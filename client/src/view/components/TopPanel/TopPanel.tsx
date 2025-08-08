import './TopPanel.scss'
import PersonArea, {PersonAreaProps} from "../PersonArea/PersonArea";

interface TopPanelProps {
    userData: PersonAreaProps
}

const TopPanel = (props: TopPanelProps) => {
    return (
        <div className={"topPanel__wrapper"}>
            <h1 style={{marginLeft: '20px'}}>Lexeme</h1>
            <PersonArea imgUrl={props.userData.imgUrl} />
        </div>
    )
}

export default TopPanel