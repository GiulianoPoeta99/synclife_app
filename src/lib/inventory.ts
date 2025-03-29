export const BASE_URL_I = `${import.meta.env.PUBLIC_BASE_URL}/inventory`;


export async function getAllInventoryItems(sessionToken: string) {
  const response = await fetch(`${BASE_URL_I}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'session-token': sessionToken,
    },
  });

  if (!response.ok) {
    console.error('Error al obtener inventario:',response.status);
    return [];
  }

  const data = await response.json();
  return data;
}

export async function getInventoryItem(inventoryId: string,sessionToken: string) {
  const response = await fetch(`${BASE_URL_I}/${inventoryId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'session-token': sessionToken,
    },
  });

  if (!response.ok) {
    console.error(`Error al obtener el producto ${inventoryId}:`);
    return null;
  }

  const data = await response.json();
  return data.inventory;
}

export async function createInventoryItem(productName: string,amount: number,expirationDate: string,sessionToken: string) {
  const response = await fetch(`${BASE_URL_I}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'session-token': sessionToken,
    },
    body: JSON.stringify({
      product_name: productName,
      amount,
      expiration_date :expirationDate}),
  });

  const data = await response.json();
  if (!response.ok) {
    console.error("Error en createInventoryItem:", data);
  }
  return data;
}

export async function updateInventoryItem(
  inventoryId: string,
  productName: string,
  amount: number,
  expirationDate: string,
  sessionToken: string
) {
  const response = await fetch(`${BASE_URL_I}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'session-token': sessionToken,
    },
    body: JSON.stringify({
      inventory_id: inventoryId,
      product_name: productName,
      amount,
      expiration_date: expirationDate}),
  });

  const data = await response.json();
  if (!response.ok) {
    console.error("Error en updateInventoryItem:", data);
  }
  return data;
}

export async function deleteInventoryItem(
  inventoryId: string,
  sessionToken: string
) {
  const response = await fetch(`${BASE_URL_I}/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'session-token': sessionToken,
    },
    body: JSON.stringify({ inventory_uuid: inventoryId }),
  });

  const data = await response.json();
  if (!response.ok) {
    console.error("Error en deleteInventoryItem:", data);
  }
  return data;
}
