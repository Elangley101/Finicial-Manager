import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const CurrencyExchange = () => {
    const [exchangeRates, setExchangeRates] = useState({});
    const [amount, setAmount] = useState(0);
    const [convertedAmount, setConvertedAmount] = useState(0);
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('EUR');
    const { authTokens } = useContext(AuthContext);

    useEffect(() => {
        const fetchExchangeRates = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/exchange-rates/', {
                    headers: {
                        'Authorization': `Bearer ${authTokens.access}`,
                    },
                });
                setExchangeRates(response.data.rates);
            } catch (error) {
                console.error('Error fetching exchange rates:', error);
            }
        };

        fetchExchangeRates();
    }, [authTokens]);

    const handleConversion = () => {
        if (exchangeRates[toCurrency]) {
            const rate = exchangeRates[toCurrency];
            setConvertedAmount(amount * rate);
        }
    };

    return (
        <div className="currency-exchange">
            <h2>Currency Exchange</h2>
            <div>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value))}
                    placeholder="Amount"
                />
                <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
                    {Object.keys(exchangeRates).map(currency => (
                        <option key={currency} value={currency}>{currency}</option>
                    ))}
                </select>
                <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
                    {Object.keys(exchangeRates).map(currency => (
                        <option key={currency} value={currency}>{currency}</option>
                    ))}
                </select>
                <button onClick={handleConversion}>Convert</button>
            </div>
            <p>Converted Amount: {convertedAmount.toFixed(2)} {toCurrency}</p>
        </div>
    );
};

export default CurrencyExchange;

