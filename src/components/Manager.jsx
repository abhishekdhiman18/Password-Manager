import React from "react";
import { useRef, useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid";

const Manager = () => {
  const ref = useRef();
  const passwordRef = useRef();
  const [form, setForm] = useState({ site: "", username: "", password: "" });
  const [passwordArray, setPasswordArray] = useState([]);

  const getPasswords = async () => {
    let req = await fetch("http://localhost:3000/");
    let passwords = await req.json();
    setPasswordArray(passwords);
    console.log(passwords);
  };

  useEffect(() => {
    getPasswords();
  }, []);

  const copyText = (text) => {
    toast("Copied to clipboard!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      // transition: Bounce,
    });

    navigator.clipboard.writeText(text);
  };

  const showPassword = () => {
    passwordRef.current.type = "text";
    console.log(ref.current.src);
    if (ref.current.src.endsWith("eyecross.png")) {
      ref.current.src = "./public/icons/eye.png";
      passwordRef.current.type = "text";
    } else {
      ref.current.src = "./public/icons/eyecross.png";
      passwordRef.current.type = "password";
    }
  };

  const savePassword = async () => {
    if (
      form.site.length > 3 &&
      form.username.length > 3 &&
      form.password.length > 3
    ) {
      // Generate the id once and use it consistently
      const newPassword = { ...form, id: uuidv4() };
  
      // Update the state with the new password
      setPasswordArray([...passwordArray, newPassword]);
      
      // Send the new password to the server
      let res = await fetch("http://localhost:3000/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPassword),
      });
  
      console.log([...passwordArray, newPassword]);
      
      // Reset the form
      setForm({ site: "", username: "", password: "" });
      
      // Show a success toast
      toast("Password saved", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      // Show an error toast if the form is invalid
      toast("Error: Password not saved");
    }
  };

  const deletePassword =async(id) => {
    console.log("Deleting password with id " + id);
    let c = confirm("Do you really want to delete this password");
    if (c) {
      setPasswordArray(passwordArray.filter((item) => item.id !== id));
      // localStorage.setItem(
      //   "passwords",
      //   JSON.stringify(passwordArray.filter((item) => item.id !== id))
      // );
      let res = await fetch("http://localhost:3000/", {
        method: "DELETE",
        headers: { "Content-Type": "application/Json" },
        body: JSON.stringify({ id}),
      });
      toast("Password deleted successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    // console.log([...passwordArray, form]);
  };

  const editPassword = (id) => {
    console.log("Editing password with id " + id);
    setForm({...passwordArray.filter((i) => i.id === id)[0],id:id});
    setPasswordArray(passwordArray.filter((item) => item.id !== id));
    // setPasswordArray([...passwordArray, {...form,id:uuidv4()}]);
    // localStorage.setItem("passwords", JSON.stringify([...passwordArray, form]));
    // console.log([...passwordArray, form]);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition="Bounce"
      />
      {/* Same as */}
      <ToastContainer />
      <div className="absolute inset-0 -z-10 h-full w-full bg-green-50  bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-green-400 opacity-20 blur-[100px]"></div>
      </div>
      <div className=" p-2 md:p-0 md:my-container min-h-[88.2vh]">
        <h1 className="text-4xl text font-bold text-center">
          <span className="text-green-500">&lt;</span>
          Pass
          <span className="text-green-500">OP/&gt;</span>
        </h1>
        <p className="text-green-900 text-lg text-center">
          Your Own Password Manager
        </p>
        <div className=" flex flex-col p-4 text-black gap-8 items-center ">
          <input
            value={form.site}
            onChange={handleChange}
            placeholder="Enter websire URL"
            className="rounded-full border border-green-500 w-full p-4 py-1"
            type="text"
            name="site"
            id="site"
          />
          <div className="flex flex-col md:flex-row  w-full justify-between gap-8">
            <input
              value={form.username}
              onChange={handleChange}
              placeholder="Enter Username"
              className="rounded-full border border-green-500 w-full p-4 py-1"
              type="text"
              name="username"
              id="username"
            />
            <div className="relative">
              <input
                ref={passwordRef}
                value={form.password}
                onChange={handleChange}
                placeholder="Enter Password"
                className="rounded-full border border-green-500 w-full p-4 py-1"
                type="password"
                name="password"
                id="password"
              />
              <span
                className="absolute right-[3px] top-[4px] cursor-pointer"
                onClick={showPassword}
              >
                <img
                  ref={ref}
                  className="p-1"
                  width={26}
                  src="./public/icons/eye.png"
                  alt=""
                />
              </span>
            </div>
          </div>

          <button
            onClick={savePassword}
            className=" flex items-center justify-center gap-4 bg-green-400 hover:bg-green-300 rounded-full px-4 py-2 w-fit border border-green-900 "
          >
            <lord-icon
              src="https://cdn.lordicon.com/jgnvfzqg.json"
              trigger="hover"
            ></lord-icon>
            Save
          </button>
        </div>
        <div className="passwords">
          <h2 className="font-bold text-2xl py-4">Your Passwords</h2>
          {passwordArray.length === 0 && <div>No passwords to show</div>}
          {passwordArray.length != 0 && (
            <table className="table-auto w-full overflow-hidden rounded-md mb-10  ">
              <thead className="bg-green-800 text-white">
                <tr>
                  <th className="py-2">Site</th>
                  <th className="py-2">Username</th>
                  <th className="py-2">Password</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-green-100">
                {passwordArray.map((item, index) => (
                  <tr key={index}>
                    <td className=" py-2 border border-white text-center ">
                      <div className="flex items-center justify-center">
                        <a href={item.site} target="_blank">
                          {item.site}
                        </a>
                        <div
                          className=" lordiconcopy size-7 cursor-pointer flex "
                          onClick={() => {
                            copyText(item.site);
                          }}
                        >
                          <lord-icon
                            style={{
                              width: "25px",
                              height: "25px",
                              paddingTop: "3px",
                              paddingLeft: "3px",
                            }}
                            src="https://cdn.lordicon.com/iykgtsbt.json"
                            trigger="hover"
                          ></lord-icon>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 border border-white text-center ">
                      <div className="flex items-center justify-center">
                        <span>{item.username}</span>
                        <div
                          className=" lordiconcopy size-7 cursor-pointer flex "
                          onClick={() => {
                            copyText(item.username);
                          }}
                        >
                          <lord-icon
                            style={{
                              width: "25px",
                              height: "25px",
                              paddingTop: "3px",
                              paddingLeft: "3px",
                            }}
                            src="https://cdn.lordicon.com/iykgtsbt.json"
                            trigger="hover"
                          ></lord-icon>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 border border-white text-center ">
                      <div className="flex items-center justify-center">
                        <span>{item.password}</span>
                        <div
                          className=" lordiconcopy size-7 cursor-pointer flex "
                          onClick={() => {
                            copyText(item.password);
                          }}
                        >
                          <lord-icon
                            style={{
                              width: "25px",
                              height: "25px",
                              paddingTop: "3px",
                              paddingLeft: "3px",
                            }}
                            src="https://cdn.lordicon.com/iykgtsbt.json"
                            trigger="hover"
                          ></lord-icon>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 border border-white text-center ">
                      <span
                        onClick={() => {
                          editPassword(item.id);
                        }}
                        className="cursor-pointer mx-1"
                      >
                        <lord-icon
                          src="https://cdn.lordicon.com/gwlusjdu.json"
                          trigger="hover"
                          style={{ width: "25px", height: "25px" }}
                        ></lord-icon>
                      </span>
                      <span
                        onClick={() => {
                          deletePassword(item.id);
                        }}
                        className="cursor-pointer mx-1"
                      >
                        <lord-icon
                          src="https://cdn.lordicon.com/skkahier.json"
                          trigger="hover"
                          style={{ width: "25px", height: "25px" }}
                        ></lord-icon>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default Manager;

// import React from "react";
// import { useRef, useState, useEffect } from "react";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { v4 as uuidv4 } from 'uuid';

// const Manager = () => {
//   const ref = useRef();
//   const passwordRef = useRef();
//   const [form, setForm] = useState({ site: "", username: "", password: "" });
//   const [passwordArray, setPasswordArray] = useState([]);

//   useEffect(() => {
//     let passwords = localStorage.getItem("passwords");
//     if (passwords) {
//       setPasswordArray(JSON.parse(passwords));
//     }
//   }, []);

//   const copyText = (text) => {
//     toast("Copied to clipboard!", {
//       position: "top-right",
//       autoClose: 5000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       progress: undefined,
//       theme: "light",
//       // transition: Bounce,
//     });

//     navigator.clipboard.writeText(text);
//   };

//   const showPassword = () => {
//     passwordRef.current.type = "text";
//     console.log(ref.current.src);
//     if (ref.current.src.endsWith("eyecross.png")) {
//       ref.current.src = "./public/icons/eye.png";
//       passwordRef.current.type = "text";
//     } else {
//       ref.current.src = "./public/icons/eyecross.png";
//       passwordRef.current.type = "password";
//     }
//   };

//   const savePassword = () => {
//     if(form.site.length>3 && form.username.length>3 && form.password.length>3){

//       setPasswordArray([...passwordArray, {...form,id:uuidv4()}]);
//       localStorage.setItem("passwords", JSON.stringify([...passwordArray, {...form,id:uuidv4()}]));
//       console.log([...passwordArray, {...form,id:uuidv4()}]);
//       setForm({ site: "", username: "", password: "" })
//       toast("Password saved", {
//         position: "top-right",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//         theme: "light",
//       });
//     }
//     else{
//       toast("Error : Password not saved")
//     }
//     };

//   const deletePassword = (id) => {
//     console.log("Deleting password with id "+id )
//     let c = confirm("Do you really want to delete this password")
//     if(c){
//       setPasswordArray( passwordArray.filter(item=>item.id!==id));
//       localStorage.setItem("passwords", JSON.stringify(passwordArray.filter(item=>item.id!==id)));
//       toast("Password deleted successfully", {
//         position: "top-right",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//         theme: "light",
//       });

//     }
//     // console.log([...passwordArray, form]);
//   };

//   const editPassword = (id) => {
//     console.log("Editing password with id "+id)
//     setForm(passwordArray.filter(i=>i.id===id)[0])
//     setPasswordArray( passwordArray.filter(item=>item.id!==id));
//      // setPasswordArray([...passwordArray, {...form,id:uuidv4()}]);
//     // localStorage.setItem("passwords", JSON.stringify([...passwordArray, form]));
//     // console.log([...passwordArray, form]);
//   };

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   return (
//     <>
//       <ToastContainer
//         position="top-right"
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="light"
//         transition="Bounce"
//       />
//       {/* Same as */}
//       <ToastContainer />
//       <div className="absolute inset-0 -z-10 h-full w-full bg-green-50  bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
//         <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-green-400 opacity-20 blur-[100px]"></div>
//       </div>
//       <div className=" p-2 md:p-0 md:my-container min-h-[88.2vh]">
//         <h1 className="text-4xl text font-bold text-center">
//           <span className="text-green-500">&lt;</span>
//           Pass
//           <span className="text-green-500">OP/&gt;</span>
//         </h1>
//         <p className="text-green-900 text-lg text-center">
//           Your Own Password Manager
//         </p>
//         <div className=" flex flex-col p-4 text-black gap-8 items-center ">
//           <input
//             value={form.site}
//             onChange={handleChange}
//             placeholder="Enter websire URL"
//             className="rounded-full border border-green-500 w-full p-4 py-1"
//             type="text"
//             name="site"
//             id="site"
//           />
//           <div className="flex flex-col md:flex-row  w-full justify-between gap-8">
//             <input
//               value={form.username}
//               onChange={handleChange}
//               placeholder="Enter Username"
//               className="rounded-full border border-green-500 w-full p-4 py-1"
//               type="text"
//               name="username"
//               id="username"
//             />
//             <div className="relative">
//               <input
//                 ref={passwordRef}
//                 value={form.password}
//                 onChange={handleChange}
//                 placeholder="Enter Password"
//                 className="rounded-full border border-green-500 w-full p-4 py-1"
//                 type="password"
//                 name="password"
//                 id="password"
//               />
//               <span
//                 className="absolute right-[3px] top-[4px] cursor-pointer"
//                 onClick={showPassword}
//               >
//                 <img
//                   ref={ref}
//                   className="p-1"
//                   width={26}
//                   src="./public/icons/eye.png"
//                   alt=""
//                 />
//               </span>
//             </div>
//           </div>

//           <button
//             onClick={savePassword}
//             className=" flex items-center justify-center gap-4 bg-green-400 hover:bg-green-300 rounded-full px-4 py-2 w-fit border border-green-900 "
//           >
//             <lord-icon
//               src="https://cdn.lordicon.com/jgnvfzqg.json"
//               trigger="hover"
//             ></lord-icon>
//             Save
//           </button>
//         </div>
//         <div className="passwords">
//           <h2 className="font-bold text-2xl py-4">Your Passwords</h2>
//           {passwordArray.length === 0 && <div>No passwords to show</div>}
//           {passwordArray.length != 0 && (
//             <table className="table-auto w-full overflow-hidden rounded-md mb-10  ">
//               <thead className="bg-green-800 text-white">
//                 <tr>
//                   <th className="py-2">Site</th>
//                   <th className="py-2">Username</th>
//                   <th className="py-2">Password</th>
//                   <th className="py-2">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-green-100">
//                 {passwordArray.map((item, index) => (
//                   <tr key={index}>
//                     <td className=" py-2 border border-white text-center ">
//                       <div className="flex items-center justify-center">
//                         <a href={item.site} target="_blank">
//                           {item.site}
//                         </a>
//                         <div
//                           className=" lordiconcopy size-7 cursor-pointer flex "
//                           onClick={() => {
//                             copyText(item.site);
//                           }}
//                         >
//                           <lord-icon
//                             style={{
//                               width: "25px",
//                               height: "25px",
//                               paddingTop: "3px",
//                               paddingLeft: "3px",
//                             }}
//                             src="https://cdn.lordicon.com/iykgtsbt.json"
//                             trigger="hover"
//                           ></lord-icon>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="py-2 border border-white text-center ">
//                       <div className="flex items-center justify-center">
//                         <span>{item.username}</span>
//                         <div
//                           className=" lordiconcopy size-7 cursor-pointer flex "
//                           onClick={() => {
//                             copyText(item.username);
//                           }}
//                         >
//                           <lord-icon
//                             style={{
//                               width: "25px",
//                               height: "25px",
//                               paddingTop: "3px",
//                               paddingLeft: "3px",
//                             }}
//                             src="https://cdn.lordicon.com/iykgtsbt.json"
//                             trigger="hover"
//                           ></lord-icon>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="py-2 border border-white text-center ">
//                       <div className="flex items-center justify-center">
//                         <span >{item.password}</span>
//                         <div
//                           className=" lordiconcopy size-7 cursor-pointer flex "
//                           onClick={() => {
//                             copyText(item.password);
//                           }}
//                         >
//                           <lord-icon
//                             style={{
//                               width: "25px",
//                               height: "25px",
//                               paddingTop: "3px",
//                               paddingLeft: "3px",
//                             }}
//                             src="https://cdn.lordicon.com/iykgtsbt.json"
//                             trigger="hover"
//                           ></lord-icon>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="py-2 border border-white text-center ">
//                       <span onClick={()=>{editPassword(item.id)}} className="cursor-pointer mx-1">
//                         <lord-icon
//                           src="https://cdn.lordicon.com/gwlusjdu.json"
//                           trigger="hover"
//                           style={{ width: "25px", height: "25px" }}
//                         ></lord-icon>
//                       </span>
//                       <span onClick={()=>{deletePassword(item.id)}} className="cursor-pointer mx-1">
//                         <lord-icon
//                           src="https://cdn.lordicon.com/skkahier.json"
//                           trigger="hover"
//                           style={{ width: "25px", height: "25px" }}
//                         ></lord-icon>
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default Manager;
