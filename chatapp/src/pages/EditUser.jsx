import ArrowLeft from '../assets/icons/arrow-left.svg?react'

export default function ExportDefualt(){
    return(<>
    <main className='main-container'>
        
        <div className='main-return-header'>
            <ArrowLeft></ArrowLeft>
            <h3>EDIT YOUR PROFILE</h3>
        </div>

           <form className='edit-user'>
            <label htmlFor='avatar'>Avatar</label>
            <input id='avatar' type='file' name='avatar-img'></input>
            <label htmlFor='username'>Username</label>
            <input id='username' type='text' placeholder='E.g. John doe'></input>
            <label htmlFor='email'>Email</label>
            <input id='email' type='email' placeholder='E.g. john@gmail.com'></input>
            <label htmlFor='bio'>Bio</label>
            <textarea id='bio' placeholder='Write about yourself...'></textarea>

            <div className='edit-user-btns'>
                <button type='button' className='cancle-btn'>Cancle</button>
                <button type='submit' className='submit-btn'>Update</button>
            </div>
           </form>
    
    </main>
    </>)
}