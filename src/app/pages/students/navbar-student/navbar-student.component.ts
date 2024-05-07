import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

interface UserData {
  usuario: string;
  nombre: string;
  rol: number;
  foto: string;
}

@Component({
  selector: 'app-navbar-student',
  templateUrl: './navbar-student.component.html',
  styleUrls: ['./navbar-student.component.css']
})
export class NavbarStudentComponent implements OnInit {
  toggle: HTMLElement | null = null;
  navigation: HTMLElement | null = null;
  main: HTMLElement | null = null;
  usuarioLogueado: UserData | null = null;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.getUserData();
      }
    });
  }

  ngOnInit(): void {
    this.initializeElements();
  }

  initializeElements(): void {
    this.toggle = document.querySelector('.toggle');
    this.navigation = document.querySelector('.navigation');
    this.main = document.querySelector('.main');

    this.addHoverClass();
    this.toggleNavigation();
  }

  addHoverClass(): void {
    const listItems = document.querySelectorAll('.navigation li');
    listItems.forEach((item: Element, index: number) => {
      item.addEventListener('mouseover', () => this.activeLink(item, index));
    });
  }

  activeLink(item: Element, index: number): void {
    const listItems = document.querySelectorAll('.navigation li');
    listItems.forEach((li: Element, i: number) => {
      li.classList.remove('hovered');
      if (i === index) {
        item.classList.add('hovered');
      }
    });
  }

  toggleNavigation(): void {
    if (this.toggle && this.navigation && this.main) {
      this.toggle.onclick = () => {
        this.navigation?.classList.toggle('active');
        this.main?.classList.toggle('active');
      };
    }
  }

  getUserData() {
    const usuarioString = sessionStorage.getItem('usuario');
    if (usuarioString) {
      const userData = JSON.parse(usuarioString);
      this.usuarioLogueado = {
        usuario: userData.usuario,
        nombre: userData.nombre,
        rol: userData.rol,
        foto: userData.foto,
      };
    }
  }

  cerrarSesion() {
    sessionStorage.removeItem('usuario');
    this.usuarioLogueado = null;
    this.router.navigate(['/']);
  }
}