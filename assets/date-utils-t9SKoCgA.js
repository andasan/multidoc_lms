const o=(e,r=20)=>{const t=new Date(e);t.setDate(t.getDate()-r);const a=t.getDay();return a===0?t.setDate(t.getDate()-2):a===6&&t.setDate(t.getDate()-1),{year:t.getFullYear().toString().slice(-2),month:(t.getMonth()+1).toString().padStart(2,"0"),day:t.getDate().toString().padStart(2,"0")}},s=(e,r={})=>{if(!e)return"N/A";const a={...{month:"long",day:"numeric",year:"numeric",locale:"en-US"},...r};try{return(typeof e=="string"?new Date(e):e).toLocaleDateString(a.locale,a)}catch(n){return console.error("Error formatting date:",n),"N/A"}};export{o as c,s as f};