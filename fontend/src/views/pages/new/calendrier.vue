<script setup>
import { ref } from 'vue'

import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'

import interactionPlugin from '@fullcalendar/interaction'
import frLocale from '@fullcalendar/core/locales/fr'

import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/light-border.css'

const eventColors = {
  Normal: '#00bcd4',   // turquoise
  Important: '#ffc107', // jaune
  Urgent: '#dc3545'    // rouge
}

const defaultEvents = [
  {
    title: 'PHCIE IRYS – Abobo',
    start: '2026-01-03T08:00:00',
    end: '2026-01-03T12:00:00',
    backgroundColor: '#28a745',
    borderColor: '#28a745',
    textColor: 'white',
    extendedProps: {
      responsable: 'MME MESSOU KRAIDI',
      telephones: ['07 12 67 97 65'],
      adresse: 'ABOBO'
    }
  },
  {
    title: 'PHCIE MARCO – Cocody',
    start: '2026-01-03T14:00:00',
    end: '2026-01-03T18:00:00',
    backgroundColor: '#007bff',
    borderColor: '#007bff',
    textColor: 'white',
    extendedProps: {
      responsable: 'MR MARCO',
      telephones: ['05 11 22 33 44'],
      adresse: 'COCODY'
    }
  },
  {
    title: 'PHCIE david – Cocody',
    start: '2026-01-03T14:00:00',
    end: '2026-01-03T18:00:00',
    backgroundColor: '#dc3545',
    borderColor: '#dc3545',
    textColor: 'white',
    extendedProps: {
      responsable: 'MR david',
      telephones: ['05 11 22 33 44'],
      adresse: 'COCODY'
    }
  }
]

// Réfs
let tooltipEl = null
const calendarOptions = ref({})
const events = ref([...defaultEvents])
const showModal = ref(false)
const formMode = ref('event')
const selectedEvent = ref(null)
const newEvent = ref({
  title: '',
  responsable: '',
  telephones: '',
  adresse: '',
  colorCategory: 'Normal', // catégorie sélectionnée par défaut
  start: '',
  end: ''
})

const handleEventClick = (clickInfo) => {
  selectedEvent.value = {
    ...clickInfo.event.extendedProps,
    title: clickInfo.event.title
  }
  formMode.value = 'event'
  showModal.value = true
}

const handleDateClick = (dateInfo) => {
  const today = new Date()
  const clickedDate = new Date(dateInfo.dateStr)

  // Met l'heure à 0 pour comparer uniquement les dates
  today.setHours(0,0,0,0)
  clickedDate.setHours(0,0,0,0)

  if(clickedDate < today) {
    alert("Impossible d'ajouter un événement sur une date passée !")
    return
  }

  formMode.value = 'day'
  newEvent.value = {
    title: '',
    responsable: '',
    telephones: '',
    adresse: '',
    colorCategory: 'Normal', // couleur par défaut
    start: `${dateInfo.dateStr}T08:00:00`, // 08h00 par défaut
    end: `${dateInfo.dateStr}T12:00:00`    // 12h00 par défaut
  }
  showModal.value = true
}


const addNewEvent = () => {
  const color = eventColors[newEvent.value.colorCategory] || '#00bcd4'

  events.value.push({
    title: newEvent.value.title,
    start: newEvent.value.start,  // ex: '2026-01-03T09:30'
    end: newEvent.value.end,
    backgroundColor: color,
    borderColor: color,
    textColor: 'white',
    extendedProps: {
      responsable: newEvent.value.responsable,
      telephones: newEvent.value.telephones.split(','),
      adresse: newEvent.value.adresse
    }
  })

  sortEvents() // 🔹 tri par date/heure
  showModal.value = false
}

sortEvents()

// Options calendrier
calendarOptions.value = {
  plugins: [dayGridPlugin, interactionPlugin, listPlugin, timeGridPlugin],
  initialView: 'dayGridMonth',
  locale: frLocale,
  height: 'auto',
  contentHeight: 'auto',
  expandRows: true,
  displayEventTime: true,
  aspectRatio: 1.8,
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridDay,listWeek,dayGridMonth,listYear'
  },
  buttonIcons: {
    listWeek: 'pi pi-list',
    dayGridMonth: 'pi pi-calendar',
    dayGridWeek: 'pi pi-calendar-plus',
    dayGridDay: 'pi pi-calendar-times'
  },
  buttonText: {
    today: "Aujourd'hui",
    day: "Jour",
    month: 'Mois',
    year: 'Année',
    week: 'Semaine'
  },
  events: events.value,
  dayMaxEvents: 2,
  dayMaxEventRows: 2,
  eventClick: handleEventClick,
  dateClick: handleDateClick,
  eventDidMount: (info) => {
      if(info.event.extendedProps.responsable) {
        const content = `
          <div class="tooltip-content">
            <strong>Responsable :</strong> ${info.event.extendedProps.responsable}<br>
            <strong>Tél :</strong> ${info.event.extendedProps.telephones?.join(', ') || '-'}<br>
            <strong>Adresse :</strong> ${info.event.extendedProps.adresse || '-'}
          </div>
        `
        const bg = info.event.backgroundColor

        tippy(info.el, {
          content,
          allowHTML: true,
          theme: 'light-border',
          placement: 'top',
          arrow: true,
          interactive: true,
          maxWidth: 350,          // largeur max (important)
          theme: 'fc', // 👈 classe perso
          onShow(instance) {
            instance.popper.style.setProperty(
              '--tooltip-bg',
              bg
            )
          }
        })

        if(info.event.backgroundColor) {
          info.el.style.borderBottom = `1px solid ${bg}`
          info.el.style.color = `${bg}`
          info.el.style.margin = `2px 5px`
        }
      }
    },
  eventWillUnmount: (info) => {
    if (info.el._tippy) {
      info.el._tippy.destroy()
    }
  },

}

function sortEvents() {
  events.value.sort((a, b) => new Date(a.start) - new Date(b.start))
}

</script>

<template>
<div class="card calendar-card">
  <h1 class="calendar-title">Calendrier</h1>

  <div class="calendar-wrapper">
    <FullCalendar :options="calendarOptions" />
  </div>

  <div v-if="showModal" class="modal-backdrop" @click.self="showModal = false">
    <div class="modal-content">
      <template v-if="formMode === 'event'">
        <h2>{{ selectedEvent.title }}</h2>
        <p><strong>Responsable:</strong> {{ selectedEvent.responsable }}</p>
        <p><strong>Téléphones:</strong> <span v-for="t in selectedEvent.telephones" :key="t">{{ t }} </span></p>
        <p><strong>Adresse:</strong> {{ selectedEvent.adresse }}</p>
        <button class="btn-close" @click="showModal = false">Fermer</button>
      </template>

      <template v-else>
        <h2>Ajouter une pharmacie</h2>
        <form @submit.prevent="addNewEvent" class="form-add">
          <div>
            <label>Nom Pharmacie:</label>
            <input v-model="newEvent.title" required />
          </div>
          <div>
            <label>Responsable:</label>
            <input v-model="newEvent.responsable" required />
          </div>
          <div>
            <label>Téléphones (séparés par ,):</label>
            <input v-model="newEvent.telephones" />
          </div>
          <div>
            <label>Adresse:</label>
            <input v-model="newEvent.adresse" />
          </div>
          <div>
              <label>Début:</label>
              <input type="datetime-local" v-model="newEvent.start" required />
            </div>
            <div>
              <label>Fin:</label>
              <input type="datetime-local" v-model="newEvent.end" required />
            </div>
          <div>
              <label>Type d'événement:</label>
              <select v-model="newEvent.colorCategory">
                <option value="Normal">Normal</option>
                <option value="Important">Important</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          <div class="form-buttons">
            <button type="submit" class="btn-add">Ajouter</button>
            <button type="button" class="btn-cancel" @click="showModal = false">Annuler</button>
          </div>
        </form>
      </template>
    </div>
  </div>
</div>
</template>

<style scoped>

.calendar-card {
  width: 100%;
  overflow-x: hidden;
}

.calendar-wrapper {
  width: 100%;
  overflow-x: auto;
}

:deep(.fc) {
  max-width: 100%;
}

/* Barre du calendrier (header) */
:deep(.fc-toolbar) {
  margin-bottom: 15px !important;
}

:deep(.fc-toolbar-title) {
  font-size: 1.6rem;
  font-weight: 700;
  color: #1e40af;
}

/* Boutons (prev / next / today) */
:deep(.fc .fc-button) {
  background: linear-gradient(135deg, #2563eb, #1e40af);
  border: none;
  border-radius: 8px;
  padding: 6px 14px;
  font-weight: 600;
  color: white;
  transition: all 0.2s ease;
}

:deep(.fc .fc-button:hover) {
  background: linear-gradient(135deg, #1d4ed8, #1e3a8a);
  transform: translateY(-1px);
}

:deep(.fc .fc-button:disabled) {
  background: #2563eb;
}

/* Jours de la semaine */
:deep(.fc-col-header-cell) {
  background-color: #1e40af;
  font-weight: 700;
  color: white;
  padding: 10px 0;
  text-transform: uppercase;
  font-size: 0.85rem;
}

/* Cellules des jours */
:deep(.fc-daygrid-day) {
  background-color: #ffffff;
  transition: background 0.2s;
}

:deep(.fc-daygrid-day:hover) {
  background-color: #f8fafc;
}

/* Numéro du jour */
:deep(.fc-daygrid-day-number) {
  font-weight: 700;
  color: #475569;
  padding: 6px;
}

/* Événements (TRÈS IMPORTANT) */
:deep(.fc-event) {
  padding: 3px 6px !important;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  background: white;
}

:deep(.fc-event:hover) {
  opacity: 0.9;
  transform: scale(1.01);
}

/* Bouton “+X autres” */
:deep(.fc-daygrid-more-link) {
  font-weight: 700;
  color: #2563eb;
}

/* Jour actuel (today) */
:deep(.fc-day-today) {
  background: #e0e0e0 !important;
  color: #1e40af;
}

/* MOBILE */
@media (max-width: 768px) {

   /* ❌ cacher l'heure */
  :deep(.fc .fc-event-time,
  .fc .fc-daygrid-event-time) {
    display: none !important;
  }

  /* ❌ cacher le titre */
  :deep(.fc-daygrid-event-title) {
    display: none !important;
  }

  /* Afficher uniquement le point */
  :deep(.fc-daygrid-event-dot) {
    margin: 2px auto;
  }

  /* Centrer le point */
  :deep(.fc-daygrid-event-harness) {
    justify-content: center;
  }

  /* Toolbar empilée */
  :deep(.fc-toolbar) {
    flex-direction: column;
    gap: 6px;
  }

  :deep(.fc-toolbar-title) {
    font-size: 1.1rem;
    text-align: center;
  }

  /* Boutons compacts */
  :deep(.fc button) {
    padding: 4px 8px;
    font-size: 12px;
  }

  /* Events plus courts */
  :deep(.fc-event-title) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Cellules compactes */
  :deep(.fc-daygrid-day-frame) {
    padding: 2px;
  }
}

/* tooltip event */
:deep(.tippy-box[data-theme~='fc']) {
  font-size: 13px;
  line-height: 1.5;
}

:deep(.tippy-box[data-theme~='fc'] .tippy-content) {
  padding: 10px 14px;
  max-width: 350px;
}

:deep(.tippy-box[data-theme~='fc'] strong) {
  font-weight: 600;
}

.calendar-title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.8rem;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.modal-backdrop {
  position: fixed;
  top:0;
  left:0;
  right:0;
  bottom:0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content:center;
  align-items:center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px 25px;
  border-radius: 10px;
  min-width: 350px;
  max-width: 500px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.25);
}

.modal-content h2 {
  margin-bottom: 15px;
  color: #333;
}

.modal-content p {
  margin: 5px 0;
}

.modal-content form div {
  margin-bottom: 12px;
}

.modal-content form label {
  display: block;
  font-weight: bold;
  margin-bottom: 4px;
}

.modal-content form input {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.form-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}

.btn-add {
  background-color: #28a745;
  color: white;
  padding: 6px 14px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-add:hover {
  background-color: #218838;
}

.btn-cancel, .btn-close {
  background-color: #dc3545;
  color: white;
  padding: 6px 14px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-cancel:hover, .btn-close:hover {
  background-color: #c82333;
}
</style>
