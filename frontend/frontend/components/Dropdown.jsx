import React,{useState,useEffect} from 'react';

export default function Dropdown({endpoint,labelText,placeholder,onSelect}){
    const [items,setitems] = useState([]);
    const [selectvalue,setselectvalue] = useState('')
    const [loading,setLoading] = useState(true);
    const [error,Seterror] = useState(null);

    useEffect(() => {
        setLoading(true);
        fetch(endpoint)
        .then((res) => {
            if(!res.ok) throw new Error('Could not fetch the data');
            return res.json();
        })
        .then((data) => {
            setitems(data);
            setLoading(false);
        })
        .catch((err) => {
            Seterror(err.message);
            setLoading(false);
        });
    },[endpoint]);

    return (
        <>
            <div style={{mariginBottom:'20px',fontFamily:'Arial, sans-serif'}}>
                <label style={{display:'block',fontWeight:'bold',marginBottom:'8px',color:'#333'}}>
                    {labelText}
                </label>

                {loading && <p style={{margin:0,color:'#666',fontSize:'14px'}}>Querying postgres...</p>}
                {error && <p style={{margin:0,color:'red',fontSize:'14px'}}>Error...</p>}

                {!loading && !error &&(
                    <select
                        value={selectedValue}
                        onChange={(e) => {
                            setselectvalue(e.target.value);
                            if (onSelect) onSelect(e.target.value);
                        }}
                        style={{
                            padding: '10px',
                            width: '100%',
                            maxWidth: '300px',
                            borderRadius: '6px',
                            border: '1px solid #ccc',
                            fontSize: '14px',
                            backgroundColor: '#fff'
                        }}
                        >
                        <option value="" disabled>-- {placeholder} --</option>
                        {items.map((item) => (
                            <option key = {item.id} value={item.id}>
                                {label.label_text}
                            </option>
                        ))}
                        </select>
                )}

            </div>
        
        </>
    )
}