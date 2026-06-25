const STORAGE_HINT = 'Revisa que Safari/Chrome permita guardar datos de sitios web y que el dispositivo tenga espacio disponible.';

export class UserVisibleError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = 'UserVisibleError';
    this.code = options.code || 'USER_VISIBLE_ERROR';
    this.title = options.title || 'No se pudo completar la acción';
    this.cause = options.cause;
  }
}

export function userError(message, options = {}) {
  return new UserVisibleError(message, options);
}

export function friendlyError(error, context = 'general') {
  if (error?.name === 'UserVisibleError') {
    return {
      title: error.title,
      message: error.message,
      code: error.code
    };
  }

  if (error?.name === 'QuotaExceededError') {
    return {
      title: 'No queda espacio para guardar',
      message: `El navegador no ha podido guardar los datos porque el almacenamiento parece estar lleno. ${STORAGE_HINT}`,
      code: 'STORAGE_FULL'
    };
  }

  if (error?.name === 'InvalidStateError' || error?.name === 'NotFoundError') {
    return {
      title: 'No se pudo acceder al historial',
      message: `No se ha podido abrir la base de datos local del navegador. Cierra y vuelve a abrir la app. ${STORAGE_HINT}`,
      code: 'DATABASE_UNAVAILABLE'
    };
  }

  if (error?.name === 'SecurityError') {
    return {
      title: 'El navegador ha bloqueado el almacenamiento',
      message: 'La app no puede guardar datos en este contexto. Prueba a abrirla desde una URL HTTPS o desde Safari/Chrome normal, no desde navegación privada.',
      code: 'STORAGE_BLOCKED'
    };
  }

  if (error instanceof SyntaxError || context === 'import') {
    return {
      title: 'No se pudo leer la copia',
      message: 'El archivo seleccionado no parece ser una copia JSON válida del simulador. Elige una copia exportada desde esta app.',
      code: 'BAD_IMPORT_FILE'
    };
  }

  if (context === 'pdf') {
    return {
      title: 'No se pudo generar el PDF',
      message: 'No se ha podido crear el informe. Guarda la simulación y vuelve a intentarlo. Si el problema continúa, prueba desde Safari o Chrome actualizado.',
      code: 'PDF_ERROR'
    };
  }

  if (context === 'save') {
    return {
      title: 'No se pudieron guardar los cambios',
      message: `La simulación sigue abierta, pero los últimos cambios podrían no haberse guardado. ${STORAGE_HINT}`,
      code: 'SAVE_ERROR'
    };
  }

  if (context === 'export') {
    return {
      title: 'No se pudo descargar la copia',
      message: 'El navegador no ha permitido descargar el archivo. Prueba de nuevo o usa el botón de compartir/descargar del navegador.',
      code: 'EXPORT_ERROR'
    };
  }

  return {
    title: 'Ha ocurrido un problema',
    message: 'La acción no se ha completado. Puedes seguir usando la app; si vuelve a ocurrir, cierra y abre de nuevo antes de desplegar.',
    code: 'UNKNOWN_ERROR'
  };
}