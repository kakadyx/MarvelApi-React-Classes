import './charInfo.scss';
import {Component} from 'react'
import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import Skeleton from '../skeleton/Skeleton'
import PropTypes from 'prop-types';

class CharInfo extends Component {
    state = {
        char: null,
        loading: false,
        error: false
    }

    marvelService = new MarvelService()

    componentDidMount(){
        this.updateChar()
    }
    componentDidUpdate(prevProps, prevState){
        if(this.props.charId !== prevProps.charId)
            this.updateChar()
    }

    updateChar = () => {
        const {charId} = this.props
        if(!charId)
            return
        
        this.setState({loading: true})
        this.marvelService.getCharacter(charId)
            .then(this.onCharLoaded)
            .catch(this.onError)
    }

    onCharLoaded = (char) => {
        this.setState({char})
        this.setState({loading: false})
    }

    onError = (err) => {
        this.setState( {
            error: true,
            loading:false
        })
    }

    render(){
        const {char,loading, error} = this.state
        const skeleton = char || loading || error ? null : <Skeleton/> 
        const errorMessage = error ? <ErrorMessage/> : null
        const spinner = loading ? <Spinner/> : null
        const content = !(loading || error) && char ? <View char={char}/> : null

        return (
            <div className="char__info">
                {skeleton}
                {errorMessage || spinner}
                {content}
            </div>
        )
    }
    
}

const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = char
    return (
        <>
        <div className="char__basics">
            <img style={char.thumbnail.indexOf('not_available') > -1 ? {objectFit: 'fill'} : {}} src={thumbnail} alt="char_img" />
            <div>
                <div className="char__info-name">{name}</div>
                <div className="char__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div><div className="char__descr">
                {description}
            </div><div className="char__comics">Comics:</div><ul className="char__comics-list">
            {   
                comics.length ? 
                comics.slice(0,10).map((comics,i) => {
                    return (
                        <li className="char__comics-item" key={i}>
                            {comics.name}
                        </li>
                    )
                }) :
                "There is no comics available"
            }
                
            </ul>
            </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number,
}

export default CharInfo;