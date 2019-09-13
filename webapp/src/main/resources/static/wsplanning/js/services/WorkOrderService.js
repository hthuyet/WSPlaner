UserWebApp.service('WorkOrderService', function ($http, $q) {
  var WorkOrderService = {};
  WorkOrderService.detail = function (WorkOrderId,LoadRows,LoadAttachment,LoadAttachmentData) {
    return $http({
      method: 'POST',
      url: '/wo/detail',
      data: {
        "WorkOrderId": WorkOrderId,
        "LoadRows": LoadRows,
        "LoadAttachment": LoadAttachment,
        "LoadAttachmentData": LoadAttachmentData
      }
    });
  }

  WorkOrderService.jobTab = function (data) {
    return $http({
      method: 'GET',
      url: '/wo/jobTab',
      params: data
    });
  }

  WorkOrderService.serviceItem = function (data) {
    return $http({
      method: 'POST',
      url: '/wo/serviceItem',
      data: data
    });
  }

  WorkOrderService.getPhoto = function (data) {
    return $http({
      method: 'POST',
      url: '/wo/getPhoto',
      data: data
    });
  }

  WorkOrderService.getTextPredict = function (data) {
    return $http({
      method: 'POST',
      url: '/site/getTextPredict',
      data: data
    });
  }


  WorkOrderService.countServiceItem = function (data) {
    return $http({
      method: 'POST',
      url: '/wo/countServiceItem',
      data: data
    });
  }

  WorkOrderService.postWorkOrder = function (data, postAction) {
    return $http({
      method: 'POST',
      url: '/wo/workOrderTest',
      data: data,
      headers: {
        "postAction": postAction
      }
    });
  }

  WorkOrderService.shareData = {
    postAction: "",
    data: "",
    modified: false
  }

  WorkOrderService.customer = function (params) {
    return $http({
      method: 'POST',
      url: '/site/customer',
      data: params
    })
  }

  WorkOrderService.calendarMonth = function (data) {
    return $http({
      method: 'POST',
      url: '/planning',
      data: data
    });
  }


  WorkOrderService.resources = function () {
    return $http({
      method: 'GET',
      url: '/resources',
    });
  }


  WorkOrderService.getStamping = function () {
    return $http({
      method: 'GET',
      url: '/site/stampingCode',
    });
  }

  WorkOrderService.stamp = function (data) {
    return $http({
      method: 'POST',
      url: '/wo/confirm',
      data: data
    });
  }

  WorkOrderService.postNotification = function (data) {
    return $http({
      method: 'POST',
      url: '/site/postNotification',
      data: data
    });
  }

  WorkOrderService.markNotification = function (data) {
    return $http({
      method: 'POST',
      url: '/site/markNotification',
      data: data
    });
  }

  WorkOrderService.getCountNotification = function (data) {
    return $http({
      method: 'GET',
      url: '/site/getCountNotification',
      params: { smanid: data }
    });
  }

  WorkOrderService.getNotification = function (data) {
    return $http({
      method: 'GET',
      url: '/site/getNotification',
      params: { smanid: data }
    });
  }

  WorkOrderService.getNotificationType = function (data) {
    return $http({
      method: 'POST',
      url: '/notification/getNotificationType',
      data: data
    });
  }

  WorkOrderService.getCountNotificationType = function (data) {
    return $http({
      method: 'POST',
      url: '/notification/getCountNotificationType',
      data: data
    });
  }


  WorkOrderService.getTextLine = function () {
    return $http({
      method: 'GET',
      url: '/wo/getTextLine',
      // data: data
    });
  }

  return WorkOrderService;
});


