import React, { Component } from "react";
import axios from "axios";

import "./Convertor.css";

class Convertor extends Component {
    state = {
        result: null,
        fromCurrency: "USD",
        toCurrency: "GBP",
        amount: 1,
        currencies: []
    };

    componentDidMount() {
        axios
            .get("http://api.openrates.io/latest")
            .then(response => {
                const currency = ["EUR"];
                console.log(response.data.rates)
                for (const key in response.data.rates) {
                    currency.push(key);
                }
                this.setState({ currencies: currency.sort() });
            })
            .catch(err => {
                console.log("Opps", err.message);
            });
    }

    convertHandler = () => {
        if (this.state.fromCurrency !== this.state.toCurrency) {
            axios
                .get(
                    `http://api.openrates.io/latest?base=${this.state.fromCurrency}&symbols=${this.state.toCurrency}`
                )
                .then(response => {
                    const result =
                        this.state.amount *
                        response.data.rates[this.state.toCurrency];
                    this.setState({ result: result.toFixed(5) });
                })
                .catch(err => {
                    console.log("Opps", err.message);
                });
        } else {
            this.setState({ result: "You cant convert the same currency!" });
        }
    };

    selectHandler = (event) =>{
        if(event.target.name  === "from"){
            this.setState({fromCurrency: event.target.value})
        }
        if(event.target.name === "to"){
            this.setState({toCurrency: event.target.value})
        }
    }

    render() {
        return (
            <div className="convertor">
                <div className="form">
                    <input
                        type="text"
                        name="amount"
                        value={this.state.amount}
                        onChange={event =>
                            this.setState({ amount: event.target.value })
                        }
                    />
                    <br/>
                    <select
                        name="from"
                        onChange={event => this.selectHandler(event)}
                        value={this.state.fromCurrency}
                    >
                        {this.state.currencies.map(cur => (
                            <option key={cur}>{cur}</option>
                        ))}
                    </select>

                    <select
                        name="to"
                        onChange={event => this.selectHandler(event)}
                        value={this.state.toCurrency}
                    >
                        {this.state.currencies.map(cur => (
                            <option key={cur}>{cur}</option>
                        ))}
                    </select>
                    <br/>
                    <button onClick={this.convertHandler}>Convert</button> 
                    {<h3>{this.state.result}</h3>}
                </div>
               
            </div>
        );
    }
}
export default Convertor;
