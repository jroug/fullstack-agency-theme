const preloadImage = (image) => {
    if (image!==undefined){
        const newImage = new Image();
        newImage.src = image;
        window[image] = newImage;
    }
}

const logginF = (txt) => {
    if(process.env.NODE_ENV==="development"){
        console.log(txt);
    }
    return;
}


export {
    preloadImage,
    logginF
}
