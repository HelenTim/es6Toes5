async function es(){
  let a = await new Promise((resolve)=>{
    setTimeout(()=>{
      resolve()
    }, 100)
  })
  console.log(a)
}