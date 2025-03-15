const http = require('http');
const fs = require('fs');
const qs = require('querystring');

let list = []

let server = http.createServer((req, res) => {

    // res.setHeader('content-type','application/json')

    const {url, method} = req
    let id = 2;
    try {
        list = JSON.parse(fs.readFileSync('./list.json', 'utf-8'));
        
    } catch (err) {
        console.error("Error reading list.json:", err);  
    }
    if(method == 'GET' && url == "/"){
        const html = fs.readFileSync('./index.html')
        res.end(html)
    }
    else if(method == 'GET' && url == "/list"){
       

            res.end(JSON.stringify(JSON.parse(fs.readFileSync('./list.json'))))  
    }
    else if(method == 'POST' && url == "/list"){

        let body = ''
        req.on('data',(chunk)=>{
             
            body = chunk.toString()
            console.log(body)
            let task = qs.parse(body)
            console.log(task)
            task.id = list.length + 1
            list.push(task) 
            fs.writeFileSync('./list.json',JSON.stringify(list))
            res.end("Success")
                                                   
           
        }) 
        
        
    } 
    else if(method == 'PUT' && url .startsWith('/list/')){

        let body = ''
        let id = Number(url.split('/')[2])
        req.on('data',(chunk)=>{
            
            body = chunk.toString()
            console.log(body)
            let task = qs.parse(body)
            // console.log(task)
            let idx = -1;
            for(let i = 0; i < list.length; i++){
                if(list[i].id == id){
                    idx = i;
                    break
                }
            }
            if(idx == -1){
                res.statusCode = 404
                return res.end(JSON.stringify({message : "Not found"}))
            }
          
            task.id = list[idx].id;
            list[idx] = task 
            fs.writeFileSync('./list.json',JSON.stringify(list))
            res.end(JSON.stringify({message : "success"}))
           
        }) 
       
     
        
    }
    else if(method == 'DELETE' && url .startsWith('/list/')){

        let body = ''
        let id = Number(url.split('/')[2])
    
        let idx = -1;
        for(let i = 0; i < list.length; i++){
            if(list[i].id == id){
                idx = i;
                break
            }
        }
        if(idx == -1){
            res.statusCode = 404
            return res.end(JSON.stringify({message : "Not found"}))
        }
      
            list.splice(idx,1)
            for(let i = idx; i <list.length; i++){
                list[i].id--;
            }
            fs.writeFileSync('./list.json',JSON.stringify(list))
            res.end(JSON.stringify({message : "success"}))
        
        
    }
    
    
})


server.listen(3000,(err) => {
    console.log("server is running...");
    

})
