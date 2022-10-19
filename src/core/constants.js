export const EMPTY_ASYNC_FUNC = async function () {}

export const CSM_SPLITS_CALLBACK = ( amount, near, far, target ) => {

    for ( let i = amount - 1; i >= 0; i-- ) target.push( Math.pow( 1 / 4, i ) )

}