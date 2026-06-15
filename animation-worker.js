
self.onmessage = function (e) {

    const { framesCount, verticesCount, objAnimPos } = e.data;

    const TEXTURE_SIZE = 4096;

    const totalPixelsNeeded = framesCount * verticesCount;
    const requiredResolution = Math.ceil(Math.sqrt(totalPixelsNeeded));

    let textureWidth = 4096;
    let textureHeight = 4096;

    // Проверяем, поместится ли в 4096x4096
    if (4096 * 4096 < totalPixelsNeeded) {
        // Если не помещается, увеличиваем до 8192
        textureWidth = 8192;
        textureHeight = 8192;

        if (8192 * 8192 < totalPixelsNeeded) {
            console.error("Даже 8192x8192 недостаточно!");
        }
    }

    // Создаем плоский массив для текстуры
    const data_img = new Float32Array(textureWidth * textureHeight * 4).fill(0);

    // Заполняем текстуру, упаковывая данные в 2D
    for (let frame = 0; frame < framesCount; frame++) {
        for (let v = 0; v < verticesCount; v++) {
            const srcIndex = (frame * verticesCount + v) * 3;

            // Вычисляем позицию в текстуре (линейная упаковка)
            const pixelIndex = frame * verticesCount + v;
            const texX = pixelIndex % textureWidth;
            const texY = Math.floor(pixelIndex / textureWidth);

            // Проверка на выход за пределы
            if (texY >= textureHeight) {
                console.warn(`Выход за пределы текстуры! frame=${frame}, v=${v}, texY=${texY}`);
                continue;
            }

            const idx = (texY * textureWidth + texX) * 4;

            data_img[idx] = objAnimPos[srcIndex];     // x
            data_img[idx + 1] = objAnimPos[srcIndex + 1]; // y
            data_img[idx + 2] = objAnimPos[srcIndex + 2]; // z
            data_img[idx + 3] = 1.0;
        }
    }

    self.postMessage({ type: 'complete', data: data_img });
};