
export function moveSelectCarLeft(cars,d,n){
    let temp = new Array();
    let k = 0;
    //shifting car one step left excluding the first one
    for(let i = d; i<n; i++){
        temp[k]=cars[i];
        k++;
    }
    //storing the first one in the last
    for(let i =0; i<d;i++){
        temp[k] = cars[i];
        k++;
    }
    //copying tempcars to selectcars array
    for(let i=0;i<n;i++){
        cars[i] = temp[i];
    }
}

export function moveSelectCarRight(cars,d,n){
    let temp = new Array();
    let k = 0;
    //shifting car one step right excluding the last one
    for(let i = d; i<n; i++){
        temp[i]=cars[k];
        k++;
    }
    //storing the last one in the first
    for(let i =0; i<d;i++){
        temp[i] = cars[n-1];
    }
    // since we are shifting by one so working for it, not sure for more than that
    //might need to change but i think not required in the future as well

    //copying tempcars to selectcars array
    for(let i=0;i<n;i++){
        cars[i] = temp[i];
    }
}

// export {moveSelectCarLeft, moveSelectCarRight}