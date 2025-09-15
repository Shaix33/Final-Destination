import React from "react";

export default function CropList({ crops }) {
  if (!crops || crops.length === 0) {
    return <p>No crop suggestions available</p>;
  }

  return (
    <ul>
      {crops.map((crop, index) => (
        <li key={index}>
          {crop.name} – {crop.reason}
        </li>
      ))}
    </ul>
  );
}
