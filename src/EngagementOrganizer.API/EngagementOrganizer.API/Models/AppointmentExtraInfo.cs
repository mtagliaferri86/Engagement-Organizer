﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EngagementOrganizer.API.Models
{
    public class AppointmentExtraInfo : Appointment
    {
        public bool Warning { get; set; }

        public string WarningDescription { get; set; }

        public string ProjectColor { get; set; }

        public bool IsFromUpstream { get; set; } = false;

    }
}
