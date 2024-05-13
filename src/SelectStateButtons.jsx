import React, { useState } from 'react';

const SelectStateButtons = ({selectedState, setSelectedState,scenarioColorMapping}) => {

    const options = [
        { id: 'pessimistic', label: 'Pessimistic'},
        { id: 'realistic', label: 'Realistic'},
        { id: 'optimistic', label: 'Optimistic' }
    ];

    const handleSelect = (optionId) => {
        setSelectedState(optionId);
    };

    return (
        <div
            style={{
            display: 'flex',
            justifyContent: 'center', // Center the buttons horizontally
            gap: '10px',  // Adds space between buttons
                // alignItems: 'center'
        }}
        >
            {options.map(option => (
                <button key={option.id}
                        onClick={() => handleSelect(option.id)}
                        style={{
                            // borderRadius: '50%', // Makes the button round
                            width: '100px',       // Fixed width
                            height: '30px',      // Fixed height, same as width to maintain round shape
                            marginBottom:'0px',
                            backgroundColor: selectedState === option.id ? scenarioColorMapping[option.id] : '#f0f0f0', // Change color when selected
                            color: selectedState === option.id ? 'white' : 'black', // Change text color based on selection
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s', // Smooth transition for background color
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                    {option.label}
                </button>
            ))}
        </div>
    );
};

export default SelectStateButtons;
