import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CursoService } from '../services/courses.service';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { environment } from 'src/environments/environment';
import { PayPalConfigExtended } from '../../../models/paypal-config.model';
import { Router, NavigationExtras } from '@angular/router';
@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {
  // showPayPalButtons = false;
  horarioId: string | null = null;
  profesorId: string | null = null;
  horario: any;
  profesor: any;
  public payPalConfig?: PayPalConfigExtended;
  constructor(
    private route: ActivatedRoute,
    private cursoService: CursoService,
    private router: Router
  ) { }
  ngOnInit() {
    // this.initConfig();
    this.horarioId = this.route.snapshot.paramMap.get('horarioId');
    this.profesorId = this.route.snapshot.paramMap.get('profesorId');
  
    if (this.horarioId && this.profesorId) {
      this.obtenerDetallesHorario();
      this.obtenerDetallesProfesor();
    } else {
      console.error('No se encontraron los parámetros horarioId y profesorId en la ruta');
    }
  }
  // private initConfig(): void {
  //   this.payPalConfig = {
  //     currency: 'USD',
  //     clientId: environment.payPalClientId, // Reemplaza con tu ID de cliente de PayPal
  //     createOrderOnClient: (data) => <ICreateOrderRequest>{
  //       intent: 'CAPTURE',
  //       purchase_units: [{
  //         amount: {
  //           currency_code: 'USD',
  //           value: '9.99', // Reemplaza con el monto a pagar
  //           breakdown: {
  //             item_total: {
  //               currency_code: 'USD',
  //               value: '9.99' // Reemplaza con el monto a pagar
  //             }
  //           }
  //         },
  //         items: [{
  //           name: 'Inscripción al curso', // Reemplaza con la descripción del pago
  //           quantity: '1',
  //           category: 'DIGITAL_GOODS',
  //           unit_amount: {
  //             currency_code: 'USD',
  //             value: '9.99', // Reemplaza con el monto a pagar
  //           },
  //         }]
  //       }]
  //     },
  //     advanced: {
  //       commit: 'true'
  //     },
  //     style: {
  //       label: 'paypal',
  //       layout: 'vertical'
  //     },
  //     onApprovePayment: (data, actions) => {
  //       console.log('onApprovePayment - you should make an AJAX call to your server to complete the payment', data, actions);
  //       this.registrarInscripcion(); // Llama al método registrarInscripcion después de un pago exitoso
  //     },
  //     onClientAuthorization: (data) => {
  //       console.log('onClientAuthorization - you should fire tracking events here', data);
  //     },
  //     onCancel: (data, actions) => {
  //       console.log('OnCancel', data, actions);
  //     },
  //     onError: err => {
  //       console.log('OnError', err);
  //     },
  //     onClick: (data, actions) => {
  //       console.log('onClick', data, actions);
  //     },
  //   };
  
  //   this.showPayPalButtons = true;
  // }
  obtenerDetallesHorario() {
    if (this.horarioId) {
      // Llama al servicio para obtener los detalles del horario
      this.cursoService.obtenerHorariosPorId(this.horarioId).subscribe(
        horario => this.horario = horario
      );
    } else {
      console.error('ID del horario no válido');
    }
  }
  
  obtenerDetallesProfesor() {
    if (this.profesorId) {
      // Llama al servicio para obtener los detalles del profesor
      this.cursoService.obtenerProfesorPorId(this.profesorId).subscribe(
        profesor => this.profesor = profesor
      );
    } else {
      console.error('ID del profesor no válido');
    }
  }
  
  registrarInscripcion() {
    // Obtener el ID del alumno logueado desde sessionStorage
    const usuario = JSON.parse(sessionStorage.getItem('usuario') || '{}');
    const alumnoId = usuario.id;
  
    if (!alumnoId) {
      console.error('No se pudo obtener el ID del alumno logueado');
      return;
    }
  
    // Aquí debes llamar al servicio para registrar la inscripción
    // Asegúrate de tener un método en el CursoService para registrar una inscripción
    const inscripcion = {
      Alumnos_id: alumnoId,
      Profesores_id: this.profesorId,
      Horario_id: this.horarioId
    };
  
    this.cursoService.registrarInscripcion(inscripcion).subscribe(
      () => {
        console.log('Inscripción registrada correctamente');
        // Redirigir al usuario a /home en caso de éxito
        this.router.navigate(['/home']);
      },
      error => {
        console.error('Error al registrar la inscripción:', error);
        // Mostrar mensaje de alerta en caso de error
        alert('Error al registrar la inscripción. Por favor, inténtalo de nuevo.');
      }
    );
  }
}