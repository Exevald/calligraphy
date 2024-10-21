import './Button.scss'
import ButtonIcon from '../ButtonIcon/ButtonIcon'

interface ButtonProps {
    id?: string,
    type: 'submit' |
        'filled' | 'transparent' |
        'filledNoColor' | 'transparentNoColor' |
        'transparentDisabled',
    iconType?: 'add' | 'minus' | 'more' | 'minusTransparent',
    onClick?: () => void,
    data: string;
}

const Button = (props: ButtonProps) => {
    const buttonType = props.type
    let buttonStyle = `buttons__default buttons__${buttonType}`

    switch (buttonType) {
        case 'submit':
            buttonStyle += ' buttons__filled'
            return (
                <button id={props.id} className={buttonStyle} onClick={props.onClick}>
                    {props.data}
                </button>
            )
        default:
            props.iconType ? buttonStyle += ' buttons__hasIcon' : null
            return (
                <button id={props.id} className={buttonStyle} onClick={props.onClick}>
                    {
                        props.iconType &&
                        <ButtonIcon type={props.iconType}/>
                    }
                    {props.data}
                </button>
            )
    }
}

export {Button}