import copy from '../Assets/clone-regular.svg';
import showAlert from '../Functions/Alert';
import { useSelector } from 'react-redux';
import { QRCodeSVG } from 'qrcode.react'

const Payment = () => {
    const UPI_Id = useSelector((state) => state.paymentInfo.UPI_Id);
    const Amount = useSelector((state) => state.paymentInfo.Amount);
    if(!UPI_Id){
        showAlert({
            title: "Please set UPI Id",
            icon: "error"
        });
        return;
    }

    let qrCodeData = `upi://pay?pa=${UPI_Id}`;
    if (Amount) {
        qrCodeData = qrCodeData + `&tn=Payment&am=${Amount}&cu=INR`
    }

    return (
        <div style={{ width: "100%", display: 'flex', margin: "1rem auto", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontSize: "20px", display: "flex", justifyContent: "center" }}>
                Please scan the QR code to make the payment
            </div>
            <div>
                <div style={{ margin: "1rem 0" }}>
                    <div style={{ display: "flex", width: "100%", justifyContent: "center", margin: "1rem" }}>
                        <QRCodeSVG value={qrCodeData} size={200} />,
                    </div>
                </div>
                <div style={{ display: "flex", justifyContent: "center", fontSize: "20px" }}>
                    UPI Id: {UPI_Id} <img src={copy} alt="copy" style={{ width: "20px", height: "20px", cursor: "pointer", marginTop: "2px", marginLeft: "10px" }} onClick={() => {
                        navigator.clipboard.writeText(UPI_Id);
                        showAlert({ title: "UPI Id copied to clipboard", icon: "success" });
                    }} />
                </div>
            </div>
        </div>
    );
}

export default Payment;
