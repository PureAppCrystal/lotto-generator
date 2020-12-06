import React, {Component} from 'react';

import './App.css';
import axios from "axios";


const LOTTO_URL = "/common.do?method=getLottoNumber&drwNo=";
  let LOTTO_RESULTS = []
class App extends Component {

  

  test = () => {
    console.log('hi test')
    this.getLottoHistory();
  }

  getLottoHistory = async () => {
    console.log("getLottoHistory")
    const result = await axios.get("/common.do?method=getLottoNumber&drwNo=954");
    console.log('result : ', result);
    
  }

  getLottoHistoryAll = async () => {

    let drwNo = 0;
    while(true) {
      drwNo = drwNo + 1;
      console.log("try drwNo : ", drwNo)
      let url = LOTTO_URL + drwNo;
      const result = await axios.get(url);

      if ( drwNo > 10 ) break;


      if( result.data.returnValue ) {
        const data = result.data;
        console.log('data : ', data)
        let obj =new game(data.drwNo, data.drwNoDate, data.drwtNo1, data.drwtNo2, data.drwtNo3, data.drwtNo4, data.drwtNo5, data.drwtNo6, data.bnusNo) 
        console.log('game : ', obj)
       
        LOTTO_RESULTS.push(obj);
      } else {
        console.log('last drwNo : ', (drwNo - 1))
        break;
      }
    }

    console.log("LOTTO_RESULTS : " , LOTTO_RESULTS)
    this.testWriteTextFile("로또당첨번호목록", JSON.stringify(LOTTO_RESULTS))
  }

  compare = () => {
    let beforeGame = null;
    LOTTO_RESULTS.forEach( game => {
      if(beforeGame) {
        if ( game.getIsSame(beforeGame) ) {
          console.log("======= FIND SAME GAME RESULT =========")
        } else {
          console.log("Dif")
        }
        console.log("beforeGame : ", beforeGame)
        console.log("game : " , game)
      }
      beforeGame = game
    })
  }



  loadTextFile(e){
    let file = e.target.files[0];
    let fileReader = new FileReader();
    fileReader.onload = () => {
      console.log(fileReader.result);
    };
    fileReader.readAsText(file);
  }

  writeTextFile = () => {
    this.testWriteTextFile("test", "content");
  }

  testWriteTextFile = (fileName, content) => {
    var blob = new Blob([content], { type: 'text/plain' });
    var objURL = window.URL.createObjectURL(blob);
            
    // 이전에 생성된 메모리 해제
    if (window.__Xr_objURL_forCreatingFile__) {
        window.URL.revokeObjectURL(window.__Xr_objURL_forCreatingFile__);
    }
    window.__Xr_objURL_forCreatingFile__ = objURL;
    var a = document.createElement('a');
    a.download = fileName;
    a.href = objURL;
    a.click();
  }

  render() {

  
    return (
      <div className="App">
        hello
        <button onClick={this.test}> getOne </button>
        <button onClick={this.getLottoHistoryAll}> getHistoryAll </button>
        <button onClick={this.compare}> compare </button>

        <input type="file" onChange={this.loadTextFile.bind(this)} />
        <button onClick={this.writeTextFile}> writeTextFile </button>
      </div>
    );
}
}

export default App;

class game {

  constructor(drwNo, drwNoDate, drwtNo1, drwtNo2, drwtNo3, drwtNo4, drwtNo5, drwtNo6, bnusNo) {
    this.drwNo = drwNo;
    this.drwNoDate = drwNoDate
    
    this.drwtNo1 = drwtNo1;
    this.drwtNo2 = drwtNo2;
    this.drwtNo3 = drwtNo3;
    this.drwtNo4 = drwtNo4;
    this.drwtNo5 = drwtNo5;
    this.drwtNo6 = drwtNo6;
    
    this.bnusNo = bnusNo;
  }

  print() {
    console.log(this)
  }

  getNumList(){
    return [

      this.drwtNo1,
      this.drwtNo2,
      this.drwtNo3,
      this.drwtNo4,
      this.drwtNo5,
      this.drwtNo6,
    
      this.drwNo,
      this.drwNoDate,
      this.bnusNo]
  }

  getIsSame(game) {
    let returnValue = false;
    if ( this.drwtNo1 === game.drwtNo1 &&
          this.drwtNo2 === game.drwtNo2 &&
          this.drwtNo3 === game.drwtNo3 &&
          this.drwtNo4 === game.drwtNo4 &&
          this.drwtNo5 === game.drwtNo5 &&
          this.drwtNo6 === game.drwtNo6 ) {
            returnValue = true;
          }
    return returnValue;
  }

}