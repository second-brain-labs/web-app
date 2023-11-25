/**
 * Interface for the folder data type return from the backend
 */
interface IFolder {
    name: string,
    user_uuid: string,
    parent: string,
  }
  
  export default IFolder;