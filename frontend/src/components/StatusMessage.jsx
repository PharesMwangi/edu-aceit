export default function StatusMessage({ status }){
    if(!status) return null;
    return <div className={`status-msg ${status.type}`}> {status.text} </div>;
}