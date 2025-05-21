import {ToastSeverity} from '@primevue/core/api';

export class toastService {
  constructor(toastInstanse, defaultLifeTime) {
    this.toastInstanse = toastInstanse
    this.defaultLifeTime = defaultLifeTime ? defaultLifeTime : "3000" 
  }
  info(body = '', title = 'Info', lifeTime = this.defaultLifeTime){
        this.toastInstanse.add({severity: ToastSeverity.INFO, summary: title, detail: body, life: lifeTime});
  }
  success(body = '', title = 'Success', lifeTime = this.defaultLifeTime){
        this.toastInstanse.add({severity: ToastSeverity.SUCCESS, summary: title, detail: body, life: lifeTime});
  }
  error(body = '', title = 'Error', lifeTime = this.defaultLifeTime){
      this.toastInstanse.add({severity: ToastSeverity.ERROR, summary: title, detail: body, life: lifeTime});
  }
  warn(body = '', title = 'Warn', lifeTime = this.defaultLifeTime){
    this.toastInstanse.add({severity: ToastSeverity.WARN, summary: title, detail: body, life: lifeTime});
  }
}