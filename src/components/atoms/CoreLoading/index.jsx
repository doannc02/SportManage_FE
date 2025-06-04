import { FaTruckLoading } from 'react-icons/fa';
import './CoreLoading.css'; // nhớ tạo file CSS này cùng thư mục

const CoreLoading = () => {
    return (
        <div className="core-loading">
            <div className="bars">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="bar" style={{ animationDelay: `${i * 0.1}s` }} />
                ))}
            </div>
            <FaTruckLoading />
        </div>
    );
};

export default CoreLoading;
