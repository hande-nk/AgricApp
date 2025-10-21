import { ProjectContext } from '../context/ProjectContext'
import { useContext} from 'react'

export const useProjectsContext = () => {
    const context = useContext(ProjectContext)
    
    if (!context) {
        throw Error('useProjectContext must be used inside an ProjectsContextProvider')
    }
    return context
}