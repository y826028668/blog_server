const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true)
mongoose.connect('mongodb://localhost/blogdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
mongoose.connection.once('open', (err) => {
  if(!err) {
    console.log('连接数据库成功');
  } else {
    console.log('链接数据库失败');
    console.log(err);
  }
})
