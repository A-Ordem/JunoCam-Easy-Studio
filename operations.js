function filtro(img, matrix){
    img.loadPixels();
    for (var i = 0; i < img.pixels.length; i += 4){
        var r = img.pixels[i];
        var g = img.pixels[i + 1];
        var b = img.pixels[i + 2];
        
        img.pixels[i]     = matrix[0]*r + matrix[3]*g + matrix[6]*b + matrix[9];
        img.pixels[i + 1] = matrix[1]*r + matrix[4]*g + matrix[7]*b + matrix[10];
        img.pixels[i + 2] = matrix[2]*r + matrix[5]*g + matrix[8]*b + matrix[11];
    }
    img.updatePixels();
}

function gamma(img, factor){
    img.loadPixels();
    for (var i = 0; i < img.pixels.length; i += 4){
      img.pixels[i]     = 255*Math.pow(img.pixels[i] / 255, 1/factor);
      img.pixels[i + 1] = 255*Math.pow(img.pixels[i + 1] / 255, 1/factor);
      img.pixels[i + 2] = 255*Math.pow(img.pixels[i + 2] / 255, 1/factor);
    }
    img.updatePixels();
}

//vetor = [-1, 0, 0, 0, -1, 0, 0, 0, -1, 255, 255, 255]//iverter cor
//vetor = [0.393, 0.349, 0.272, 0.769, 0.686, 0.534, 0.189, 0.168, 0.131, 0, 0, 0]//sepia
//gamma(imagem, 2) entre 0 e 5?

function op_brightness(imagem, value) {
    var vetor = [1, 0, 0, 0, 1, 0, 0, 0, 1, value, value, value]//brilho
    filtro(imagem, vetor);
}

function op_contrast(imagem, value) {
    var f = (259 * (value + 255)) / (255 * (259 - value));//contraste
    var vetor = [f, 0, 0, 0, f, 0, 0, 0, f, 128*(1-f), 128*(1-f), 128*(1-f)]//contraste
    filtro(imagem, vetor);
}

function op_red(imagem, value) {
    var vetor = [value, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0];//red
    filtro(imagem, vetor);
}

function op_green(imagem, value) {
    var vetor = [1, 0, 0, 0, value, 0, 0, 0, 1, 0, 0, 0];//green
    filtro(imagem, vetor);
}

function op_blue(imagem, value) {
    var vetor = [1, 0, 0, 0, 1, 0, 0, 0, value, 0, 0, 0];//blue
    filtro(imagem, vetor);
}

function op_hue(img=imgModified, hvalue=0, svalue=0, vvalue=0){
    img.loadPixels();
    for (var i = 0; i < img.pixels.length; i += 4){

        r = img.pixels[i];
        g = img.pixels[i + 1];
        b = img.pixels[i + 2];

        r = {r:r, g:g, b:b};

        h = RGBtoHSV(r);

        h.h += hvalue;
        h.s += svalue;
        h.v += vvalue;

        r = HSVtoRGB(h);

        img.pixels[i]     = r.r;
        img.pixels[i + 1] = r.g;
        img.pixels[i + 2] = r.b;
    }
    img.updatePixels();
}

function RGBtoHSV(r, g, b) {
    if (arguments.length === 1) {
        g = r.g, b = r.b, r = r.r;
    }
    var max = Math.max(r, g, b), min = Math.min(r, g, b),
        d = max - min,
        h,
        s = (max === 0 ? 0 : d / max),
        v = max / 255;

    switch (max) {
        case min: h = 0; break;
        case r: h = (g - b) + d * (g < b ? 6: 0); h /= 6 * d; break;
        case g: h = (b - r) + d * 2; h /= 6 * d; break;
        case b: h = (r - g) + d * 4; h /= 6 * d; break;
    }

    return {
        h: h,
        s: s,
        v: v
    };
}

function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}