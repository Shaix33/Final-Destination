export default function CropList({ crops }) {
  if (!crops || crops.length === 0) return <p>No crops suggested</p>;

  return (
    <ul>
      {crops.map((crop, idx) => (
        <li key={idx}>{crop}</li>
      ))}
    </ul>
  );
}
