
async function foo() {
    const result1 = await new Promise((resolve) => setTimeout(() => resolve("1"), 2000));
    console.log({ result1 });
    const result2 = await new Promise((resolve) => setTimeout(() => resolve("2"), 5000));
}
// 函数名字
console.log({ 89: 90 });
foo("waaa");


class bk { 
    hu=4
}
