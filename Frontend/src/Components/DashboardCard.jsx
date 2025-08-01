import { Card } from 'react-bootstrap';

const DashboardCard = ({ title, count, variant }) => {
  return (
    <Card bg={variant} text="white" className="mb-4 shadow-sm">
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text className="display-6">{count}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default DashboardCard;
