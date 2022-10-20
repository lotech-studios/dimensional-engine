export async function loadJSON ( url ) {

    const RESPONSE = await fetch( url )

    return await RESPONSE.json()

}