import IFile from "./file";
import ILink from "./link";

/**
 * Interface for the space data type return from the backend
 */
 interface ISpace {
    title: string;
    content: (IFile | ILink)[];
  }
  
  export default ISpace;