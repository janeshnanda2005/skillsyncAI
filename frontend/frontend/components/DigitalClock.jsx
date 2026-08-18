import react,{useState,useEffect} from 'react';

function DigitalClock(){
    const [time,seTime] = useState(new Date());

    useEffect(() => {
        const intervalid = setInterval(() => {
            setTime(new Date());
        },1000);

        return () => {
            clearInterval(intervalid);
        }
    },[])

    return (
        <div className="clock-container">
            <class className="clock">
                <span>00:00:00</span>
            </class>
        </div>
    )
}