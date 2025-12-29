from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny


class KeepAliveView(APIView):
    """
    A dummy endpoint that returns a simple response to keep the backend awake.
    This endpoint does nothing but respond to prevent the backend from sleeping in deployment.
    """
    permission_classes = [AllowAny]
    
    def get(self, request):
        """
        Return a simple response to keep the backend alive
        """
        return Response({
            'status': 'alive',
            'message': 'Backend is running',
            'timestamp': request.GET.get('timestamp', None)
        }, status=status.HTTP_200_OK)
    
    def post(self, request):
        """
        Also support POST for flexibility
        """
        return Response({
            'status': 'alive',
            'message': 'Backend is running',
            'timestamp': request.data.get('timestamp', None)
        }, status=status.HTTP_200_OK)