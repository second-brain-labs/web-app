from typing import List, Optional

from llama_index.callbacks.base import CallbackManager
from llama_index.core.base_retriever import BaseRetriever
from llama_index.schema import NodeWithScore, TextNode
from vespa.application import Vespa
from vespa.io import VespaQueryResponse


class VespaArticleRetriever(BaseRetriever):
    def __init__(
        self,
        app: Vespa,
        user: str,
        hits: int = 3,
        vespa_score_cutoff: float = 0.50,
        fields: List[str] = ["title", "content", "summary"],
        callback_manager: Optional[CallbackManager] = None,
    ) -> None:
        self.app = app
        self.hits = hits
        self.user = user
        self.vespa_score_cutoff = vespa_score_cutoff
        self.fields = fields
        self.summary_fields = ",".join(fields)
        super().__init__(callback_manager)

    def _retrieve(self, query: str) -> List[NodeWithScore]:
        yql = f"select {self.summary_fields} from articles where {{targetHits:10}}nearestNeighbor(embedding,q) or userQuery()"
        vespa_body_request = {
            "yql": yql,
            "hits": self.hits,
            "ranking.profile": "semantic",
            "timeout": "1s",
            "input.query(threshold)": self.vespa_score_cutoff,
            "input.query(q)": f'embed(e5, "{query}")',
        }

        with self.app.syncio(connections=1) as session:
            response: VespaQueryResponse = session.query(
                body=vespa_body_request, groupname=self.user
            )
            if not response.is_successful():
                raise ValueError(
                    f"Query request failed: {response.status_code}, response payload: {response.get_json()}"
                )

        nodes: List[NodeWithScore] = []
        for hit in response.hits:
            response_fields = hit.get("fields", {})
            text = ""
            for field in response_fields.keys():
                if isinstance(response_fields[field], str) and field in self.fields:
                    text += response_fields[field] + " "
            id = hit["id"]
            #
            doc = TextNode(
                id_=id,
                text=text,
                metadata=response_fields,
            )
            nodes.append(NodeWithScore(node=doc, score=hit["relevance"]))

        if not nodes:
            nodes.append(
                NodeWithScore(node=TextNode(id_="1", text="Context is empty"), score=1)
            )
        return nodes
