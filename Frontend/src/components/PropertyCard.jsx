import React from 'react';
import { CardContainer, CardBody, CardItem } from "./ui/3dCard"; // Adjust the import as necessary
import { property } from '../data/data'; // Adjust the path to the data file as necessary


const PropertyCard = () => {
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {property.length > 0 ? (
        property.map((prop) => (
          <CardContainer key={prop.id} className="property-card">
            <CardBody className="bg-gray-50 dark:bg-black border dark:border-white rounded-xl p-6 shadow-lg">
              {/* Address */}
              <CardItem translateZ={50} className="text-lg font-semibold text-neutral-700 dark:text-white">
                {prop.address}
              </CardItem>
              
              {/* Type */}
              <CardItem translateZ={40} className="text-sm font-medium text-neutral-600 dark:text-gray-300 mt-1">
                {prop.type}
              </CardItem>
              
              {/* Description */}
              <CardItem translateZ={30} className="text-neutral-500 text-sm dark:text-gray-400 mt-2">
                {prop.description}
              </CardItem>
              
              {/* Image */}
              <CardItem translateZ={60} rotateX={10} rotateZ={-5} className="w-full mt-4">
              <img
                src={prop.images}
                alt="Property Image"
                style={{ width: '100%', height: 'auto' }}
                className="object-cover rounded-md"
              />
              </CardItem>
            </CardBody>
          </CardContainer>
        ))
      ) : (
        <p>No properties available.</p>
      )}
    </div>
  );
};

export default PropertyCard;
