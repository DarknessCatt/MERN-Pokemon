import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './index.css';

function Status_bar(props){
  return (
  <tr>
    <td style={{width: "10em"}}>{props.title}: </td>
    <td style={{width: "3em"}}> {props.value} </td>
    <td> <div style={{backgroundColor: "#00f", width: `calc(100% * ${props.value}/255)`, height: "15px"}}></div> </td>
  </tr>
  );
}

function Pokemon(props){
  return (
  <div class="pokemon">
    <div class="pokemon-visual">
    {props.data.name} <br/><br/>
    {props.data.hasOwnProperty("img") ?
      <img src={props.data.img}/>
      :
      <img src="https://cdn.bulbagarden.net/upload/8/8e/Spr_3r_000.png"/>
    }

    </div>
    <div class="pokemon-stats">
    <table>
      <Status_bar
      title={"HP"}
      value={props.data.stats.hp}
      />
      <Status_bar
      title={"Attack"}
      value={props.data.stats.attack}
      />
      <Status_bar
      title={"Defense"}
      value={props.data.stats.defense}
      />
      <Status_bar
      title={"Special Attack"}
      value={props.data.stats.spattack}
      />
      <Status_bar
      title={"Special Defense"}
      value={props.data.stats.spdefense}
      />
      <Status_bar
      title={"Speed"}
      value={props.data.stats.speed}
      />
    </table>
    </div>
  </div>
  );
}

function PokeList(props){
  const pokemons = props.data.map(pokemon => {
    return(
      <div key={String(pokemon._id)}>
        <Pokemon
          data = {pokemon}
        />
        <br/>
      </div>
    );
  });

  return(
    <div>{pokemons}</div>
  )
}

class PokeForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: null,
      hp: null,
      attack: null,
      defense: null,
      spattack: null,
      spdefense: null,
      speed: null
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
  }

  handleInputChange(event){
    this.setState({[event.target.name]: event.target.value})
  }

  handleSubmit(event) {
    event.preventDefault();
    let params = "";
    for (const [key, value] of Object.entries(this.state))
      if(value) params += "&" + key + "=" + value;
    this.props.onSubmit(params);
  }

  handleCreate(event){
    event.preventDefault();

    let params = {
      name: this.state.name,
      stats: {
        hp: this.state.hp,
        attack: this.state.attack,
        defense: this.state.defense,
        spattack: this.state.spattack,
        spdefense: this.state.spdefense,
        speed: this.state.speed
      }
    };

    this.props.onCreate(params);
  }

  render(){
  return(
    <form onSubmit={this.handleSubmit}>
    <table>
      <tr>
      <td> <label for="name"> Name </label> </td>
      <td> <label for="hp"> HP </label> </td>
      <td> <label for="attack"> Attack </label> </td>
      <td> <label for="defense"> Defense </label> </td>
      <td> <label for="spattack"> Spattack </label> </td>
      <td> <label for="spdefense"> Spdefense </label> </td>
      <td> <label for="speed"> Speed </label> </td>
      </tr>
      <tr>
      <td> <input type="text" name="name" id="name" onChange={this.handleInputChange} /> </td>
      <td> <input type="number" min="0" name="hp" id="hp" onChange={this.handleInputChange} /> </td>
      <td> <input type="number" min="0" name="attack" id="attack" onChange={this.handleInputChange} /> </td>
      <td> <input type="number" min="0" name="defense" id="defense" onChange={this.handleInputChange} /> </td>
      <td> <input type="number" min="0" name="spattack" id="spattack" onChange={this.handleInputChange} /> </td>
      <td> <input type="number" min="0" name="spdefense" id="spdefense" onChange={this.handleInputChange} /> </td>
      <td> <input type="number" min="0" name="speed" id="speed" onChange={this.handleInputChange} /> </td>
      </tr>
    </table>
    <br/>
    <input type="submit" value="Search!" /> 
    &nbsp;
    <button type="button" onClick={this.handleCreate}> Create! </button>
    </form>
  )
  }
}

class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      data: null
    };
  }

  onCreate(params) {
    console.log("requesting http://localhost:3000/create")

    axios.post("http://localhost:3000/create", params).then(response => {
      alert(JSON.stringify(response.data.msg))
      if(response.data.status === 200){
        this.setState( {data: [response.data.data]} )
      }
    }).catch(console.log);
  }

  handleSubmit(params) {
    console.log("requesting http://localhost:3000/search?"+params)
    axios.get("http://localhost:3000/search?"+params).then(response => {
      this.setState({data: response.status === 200 ? response.data : null});
    }).catch(console.log);
  }

  render(){
    return(
      <div class="app">
      <h1> PokeBase </h1>
      <PokeForm
        onSubmit={(i) => this.handleSubmit(i)}
        onCreate={(i) => this.onCreate(i)}/>
      <br/>
      {
        (this.state.data && this.state.data.length) ?
        <PokeList
          data={this.state.data}
        />
        :
        <h1> No Pokemon to Show </h1>
      }
      </div>
    )
  }

}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
