import React, { useState } from 'react';

const CreateBudget = ({ onCreate }) => {
    const [name, setName] = useState('');
    const [allocated, setAllocated] = useState('');
    const [period, setPeriod] = useState('Monthly');
    const [category, setCategory] = useState('');

    const handleCreate = () => {
        onCreate({ name, allocated: parseFloat(allocated), period, category });
        setName('');
        setAllocated('');
        setCategory('');
    };

    return (
        <div className="create-budget">
            <h2>Create a New Budget</h2>
            <input
                type="text"
                placeholder="Budget Name"
                value={name}
                onChange={e => setName(e.target.value)}
            />
            <input
                type="number"
                placeholder="Allocated Amount"
                value={allocated}
                onChange={e => setAllocated(e.target.value)}
            />
            <select value={period} onChange={e => setPeriod(e.target.value)}>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
            </select>
            <input
                type="text"
                placeholder="Category"
                value={category}
                onChange={e => setCategory(e.target.value)}
            />
            <button onClick={handleCreate}>Create Budget</button>
        </div>
    );
};

export default CreateBudget;