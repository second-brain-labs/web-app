/**
 * Interface for the filedata type return from the backend
 */
interface IFile {
  title: string;
  user_id: string;
  directory: string;
  summary: string;
  id: string;
  time_created: Date;
  local_path: string;
  url: string;
}

export default IFile;
