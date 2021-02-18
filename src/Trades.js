import React, {useRef, useEffect, useState} from 'react';


const getWebsocket = (ticker) => {
    let ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${ticker}@aggTrade`);
    ws.onopen = () => {
        console.log('ws opened');
        const payload = JSON.stringify({
            method: "SUBSCRIBE",
            params: [
                `${ticker.toLowerCase()}@aggTrade`
            ],
            id: 1
        });
        ws.send(payload);
    };
    ws.onclose = () => console.log('ws closed');
    return ws;
};

export const Trades = (props) => {
    const {ticker} = props;
    const [trades, setTrades] = useState([]);
    const ws = useRef(null);

    useEffect(() => {
        ws.current = getWebsocket(ticker);

        return () => {
            ws.current.close();
        };
    }, []);

    useEffect(() => {
        if (!ws.current) {
            return;
        }

        ws.current.onmessage = e => {
            const { data: payload } = e;
            if (payload) {

                const msg = JSON.parse(payload);
                const { data } = msg;
                if (data) {
                    const { a: id, T: dt, s: symbol, p: price, q: quantity, m: isBuy } = data;
                    const side = isBuy ? 'buy' : 'sell';

                    const trade = {
                        trade_id: id,
                        side,
                        price: parseFloat(price),
                        volume: parseFloat(quantity),
                        created_at: dt,
                    };

                    if (trades.length > 10) {
                        setTrades([]);
                    } else {
                        setTrades([...trades, trade]);
                    }
                }
            }


        };
    }, [trades]);

    return (
        <div>
            <table>
                <thead>
                <tr style={{color: 'white'}}>
                    <th>ID</th>
                    <th>Side</th>
                    <th>Price</th>
                    <th>Volume</th>
                    <th>Timestamp</th>
                </tr>

                </thead>
                <tbody>
                {
                    trades.map((trade) => {
                        const {trade_id, side, price, volume, created_at} = trade;
                        const color = side == 'buy' ? 'green' : 'red';

                        return (
                            <tr key={trade_id} style={{color: color}}>
                                <td>{trade_id}</td>
                                <td>{side}</td>
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