import './TopPanel.scss'
import PersonArea, {PersonAreaProps} from "../PersonArea/PersonArea";

interface TopPanelProps {
    userData: PersonAreaProps
}

const TopPanel = (props: TopPanelProps) => {
    return (
        <div className={"topPanel__wrapper"}>
            <a className={"topPanel__logo"}></a>
            <PersonArea imgUrl={props.userData.imgUrl} />
        </div>
    )
}

export default TopPanel