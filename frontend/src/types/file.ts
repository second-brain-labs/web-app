/**
 * Interface for the filedata type return from the backend
 */
 interface IFile {
    title: string;
    summary: string;
    downloadLink: string;
  }
  
  export default IFile;