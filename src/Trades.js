import React, {useRef, useEffect, useState} from 'react';


const getWebsocket = (exchange, ticker) => {
    let ws = new WebSocket(`wss://marketdata.daix.io/marketdata/?exchange=${exchange}&ticker=${ticker}`);
    ws.onopen = () => console.log('ws opened');
    ws.onclose = () => console.log('ws closed');
    return ws;
};

export const Trades = (props) => {
    const {exchange, ticker} = props;
    const [trades, setTrades] = useState([]);
    const ws = useRef(null);

    useEffect(() => {
        ws.current = getWebsocket(exchange, ticker);

        return () => {
            ws.current.close();
        };
    }, []);

    useEffect(() => {
        if (!ws.current) {
            return;
        }

        ws.current.onmessage = e => {
            const msg = JSON.parse(JSON.parse(e.data));
            if (msg.Type == 'trade') {
                if (trades.length > 10) {
                    setTrades([]);
                } else {
                    setTrades([...trades, msg]);
                }
            }
        };
    }, [trades]);

    let previous = 0;

    return (
        <div>
            <table>
                <thead>
                <tr style={{color: 'white'}}>
                    <th>ID</th>
                    <th>Price</th>
                    <th>Volume</th>
                    <th>Timestamp</th>
                </tr>

                </thead>
                <tbody>
                {
                    trades.map((trade) => {
                        const {trade_id, price, size, volume, created_at} = trade;
                        let color = 'green';
                        if (price < previous) {
                            color = 'red';
                        }

                        previous = price;

                        return (
                            <tr style={{color: color}}>
                                <td>{trade_id}</td>
                                <td>{price}</td>
                                <td>{volume}</td>
                                <td>{created_at}</td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </table>

        </div>
    )
};