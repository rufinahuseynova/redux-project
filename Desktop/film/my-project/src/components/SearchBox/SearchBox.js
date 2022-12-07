import React, { Component } from "react";
import "./SearchBox.css";
import { addMovies } from "../../redux/actions";
import { connect } from "react-redux";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
class SearchBox extends Component {
  
  state = {
    searchLine: "",
  };
  
  searchLineChangeHandler = (e) => {
    this.setState({searchLine: e.target.value});
  };
  

   Dictaphone = (props) => {
    const { transcript, resetTranscript } = useSpeechRecognition()
    
    return (
      
      <div>
        
        <button className="buttons-speech" onClick={SpeechRecognition.startListening}>Start</button>
        <button className="buttons-speech"  onClick={()=>this.updateSearchline(transcript)}>Send</button>
        <button className="buttons-speech"  onClick={resetTranscript}>Reset</button>
        <p className="paragraf">{transcript}</p>
      </div>
    
    )
    
  }

  updateSearchline=(transcript)=>{
    SpeechRecognition.stopListening();
    this.setState({...this.state,searchLine:transcript})
  }
  searchBoxSubmitHandler = (e) => {
    e.preventDefault();
    let searchText = this.state.searchLine;
    const key = "d3496eed";
    fetch(`http://www.omdbapi.com/?s=${searchText}&apikey=${key}`)
      .then((res) => res.json())
      .then((data) => {
        this.props.dispatch(addMovies(data.Search));
      })
      .catch(error => {
       alert("We couldnt find your movie. Be sure you typed it right.")
      })
    
  };

  
  render() {
    const { searchLine } = this.state;
    return (
      <div className="search-box">
        
        <form
          className="search-box__form"
          onSubmit={this.searchBoxSubmitHandler}
        >
          <label className="search-box__form-label">
           
            <input
              value={searchLine}
              type="text"
              className="search-box__form-input"
              placeholder=" Enter a film name"
              onChange={this.searchLineChangeHandler}
            />
          </label>
          <button
            type="submit"
            className="search-box__form-submit"
            disabled={!searchLine}
          >
           Search
          </button>
          
          
        </form>
        <this.Dictaphone/>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    movies: state.movies,
  };
};

export default connect(mapStateToProps)(SearchBox);
