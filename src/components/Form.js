import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeTransaction, createTransaction } from "../features/transaction/transactionSlice";

export default function Form() {
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [amount, setAmount] = useState('');
    const [editMode, setEditMode] = useState(false);

    const dispatch = useDispatch();
    const { isLoading, isError, editing } = useSelector(state => state.transaction);
    
    //Listen for edit mode
    useEffect( () => {
        const { id, name, type, amount } = editing || {};

        if(id){
            setEditMode(true);
            setName(name);
            setType(type);
            setAmount(amount);
        }
        else{
            handleReset();
        }
    },[editing])

    const handleReset = () => {
        setName("");
        setType("");
        setAmount("");
        setEditMode(false);
    }

    const handleCreate = (e) => {
        e.preventDefault();

        dispatch(createTransaction({
            name,
            type,
            amount: Number(amount)
        }));

        handleReset();
    }

    const handleUpdate = (e) => {
        e.preventDefault();

        dispatch(changeTransaction({
            id: editing?.id,
            data: {
                name,
                type,
                amount
            }
        }))

        handleReset();
    }

    return (
        <div className="form">
            <h3>Add new transaction</h3>

            {/* <form onSubmit={handleCreate}> */}
            <form onSubmit={ editMode ? handleUpdate : handleCreate}>
                <div className="form-group">
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        required
                        placeholder="Enter title"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </div>

                <div className="form-group radio">
                    <label>Type</label>
                    <div className="radio_group">
                        <input
                            type="radio"
                            value="income"
                            name="type"
                            required
                            checked = {type === "income"}
                            onChange={e => setType("income")}
                        />
                        <label>Income</label>
                    </div>
                    <div className="radio_group">
                        <input
                            type="radio"
                            value="expense"
                            name="type"
                            checked = {type === "expense"}
                            onChange={e => setType("expense")}
                        />
                        <label>Expense</label>
                    </div>
                </div>

                <div className="form-group">
                    <label>Amount</label>
                    <input
                        type="number"
                        name="amount"
                        required
                        placeholder="Enter amount"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                    />
                </div>

                <button className="btn" type="submit" disabled={isLoading}>
                    {
                        editMode ? "Update Transaction" : "Add Transaction"
                    }
                </button>

                {
                    !isLoading && isError && <p className="error">There was an error occurred</p>
                }
            </form>
            
            {
                editMode && <button className="btn cancel_edit" onClick={handleReset}>Cancel Edit</button>
            }
        </div>
    );
}
