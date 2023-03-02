import React, { Component, Fragment } from 'react';
import CaverPage from "./Componets/CaverPage/CaverPage";
import HomePage from './Componets/HomePage/HomePage';
// import SinglOne from './Componets/SinglOne/SinglOne';
import Papa from "papaparse";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./Componets/ErrorBoundary"
import Loader from './Componets/Loader/Loader';

function Notfound () {
  
    return (
        <div>
          <h2>404 ресурс не найден!</h2>
        </div>
    );
}
class App extends Component {
  constructor() {
    super();
  this.state = {
    songs: [0],
    songsEror: null,
    loading: false
  }
  this.updateData = this.updateData.bind(this);
  }
  componentDidMount() { 
    this.setState({loading: true});
  Papa.parse("https://docs.google.com/spreadsheets/d/e/2PACX-1vSl0MHBA01lFIrj-lQVtKMQz4T1wT526-hK6Ls7DZASchNjszaawqfyUKudyR1TWSxpDbMDHX11So_0/pub?output=csv",
      {
        download: true,
        header: true,
        worker: true,
        skipEmptyLines: true,
        complete: this.updateData,
        // complete: this.setState({songs: result}),
        error: (error) => {
          console.error(error.message);
          
          //  alert("Ошибка загрузки!") 
          this.setState({songsEror: error.message})
        }
      }
    );
    this.setState({loading: false});
  }
  updateData = (result) => {
    if (!result) {
      return null
    }
    const data = result.data
    this.setState({ ...this.state, songs: data, loading: false });
  }
  render() {
    const { songs, loading, songsEror } = this.state
    if (loading)
  return (
    <Loader/>
  )
    if (songsEror) return (
       <h1 style={{ backgroundColor: "white" }}> Ошибка загрузки!..</h1>
    )
    return (
      <Fragment>
        {/* <Loader loading={this.state.loading} /> */}
        <ErrorBoundary fallback={<>Oh no! Do something!</>}>
        <Router>
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route path="/cavers" element={<CaverPage songs={songs} loading={loading} songsEror = {songsEror} />} />
            {/* <Route path="/cavers/:id" element={<SinglOne songs = {this.state.songs} />} /> */}
            <Route path="*" element={<Notfound />} />
          </Routes>
        </Router>
        </ErrorBoundary>
      </Fragment>
    );
  }
}


export default App;