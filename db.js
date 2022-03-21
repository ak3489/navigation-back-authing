const config = require('./config')
require('dotenv').config();
const mongoose = require('mongoose')
// mongoose.connect('mongodb://mybook:swen123456@115.159.3.227:27018/mybook', {useNewUrlParser: true,useUnifiedTopology: true})
// mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connect(config.dbLink, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.once('error', err => console.log('Mongo connection error',err))
db.once('open', () => console.log('Mongo connection successed'))
const LinkSchema = mongoose.Schema({
  url: String,
  title:String,
  desc:String,
  type:String,
  icon:String,
  clicks:Number,
  code:String,
}, { collection: 'link' }, {versionKey: false})

const TypeSchema = mongoose.Schema({
  type:String,
  code:String,
}, { collection: 'type' }, {versionKey: false})

const UsersSchema = mongoose.Schema({
  name: String,
  password : String,
  role: String,
  avatar:String,
  email:String,
  status:Number,
  verify_key:String,
}, { collection: 'users' }, {versionKey: false});
const roleSchema = mongoose.Schema({
  permission: String,
  id: String
}, { collection: 'role' }, {versionKey: false})
const Models = {
  Type: mongoose.model('Type', TypeSchema),
  Link: mongoose.model('Link', LinkSchema),
  Users: mongoose.model('Users',UsersSchema),
  Role: mongoose.model('Role', roleSchema)
}

module.exports = Models
