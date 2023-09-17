const express=require("express");
const router=express.Router();
const role=require('../models/roles');


const jwt = require('jsonwebtoken');

// Define a middleware function to verify the JWT token
function verifyToken(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Authentication token is missing' });
  }

  try {
    const decoded = jwt.verify(token, 'your-secret-key'); // Use your actual secret key
    req.user = decoded;
    next(); // Move to the next middleware or route handler
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// Apply the verifyToken middleware to the / route
router.get('/', verifyToken, async (req, res) => {
  try {
    const roles = await role.find();
    res.send(roles);
  } catch (err) {
    res.status(500).send('Error: ' + err);
  }
});

// router.get('/',async(req,res)=>
// {
//     try{
       
// const roles= await role.find();
// res.send(roles);

//     }
//     catch(err)
//     {
      
//         res.send("error: "+ err);
//     }
    
   

// });
router.post('/',async(req,res)=>{
    const newRole = new role({

    role_name: req.body.role_name,
    department: req.body.department,
    responsibilities :req.body.responsibilities,
    qualifications :req.body.qualifications,
    salary: req.body.salary
})
try{
   const details= await  newRole.save();
   res.json(details);

}
catch(err)
{
res.send(err)
}
})
router.delete('/:id', async (req, res) => {
    try {
      const roleId = req.params.id;
  
      // Find the role by ID and remove it
      const deletedRole = await role.findByIdAndRemove(roleId);
  
      if (!deletedRole) {
        return res.status(404).json({ message: 'Role not found' });
      }
  
      res.json({ message: 'Role deleted successfully' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });


  router.put('/:id', async (req, res) => {
    try {
        const roleId = req.params.id;
        const updatedRoleData = {
            role_name: req.body.role_name,
            department: req.body.department,
            responsibilities: req.body.responsibilities,
            qualifications: req.body.qualifications,
            salary: req.body.salary,
        };

        const updatedRole = await role.findByIdAndUpdate(roleId, updatedRoleData, { new: true });

        if (!updatedRole) {
            return res.status(404).json({ message: 'Role not found' });
        }

        res.json(updatedRole);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

  // router.put('/:id', async (req, res) => {
  //   try {
  //     const roleId = req.params.id;
  //     const updatedRoleData = {
  //       role_name: req.body.role_name,
  //       department: req.body.department,
  //       responsibilities: req.body.responsibilities,
  //       qualifications: req.body.qualifications,
  //       salary: req.body.salary
  //     };
  
  //     // Find the role by ID and update its data
  //     const updatedRole = await role.findByIdAndUpdate(roleId, updatedRoleData, { new: true });
  
  //     if (!updatedRole) {
  //       return res.status(404).json({ message: 'Role not found' });
  //     }
  
  //     res.json(updatedRole);
  //   } catch (err) {
  //     res.status(400).json({ error: err.message });
  //   }
  // });
 
module.exports=router;