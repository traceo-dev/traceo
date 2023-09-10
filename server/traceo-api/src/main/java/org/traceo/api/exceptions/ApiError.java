package org.traceo.api.exceptions;

import org.traceo.common.transport.enums.ResponseStatus;

record ApiError(String message, ResponseStatus status) { }
